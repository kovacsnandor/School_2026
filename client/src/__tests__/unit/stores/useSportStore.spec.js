import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useSportStore } from '@/stores/sporsStore';
import apiClient from '@/api/axiosClient';

// 1. Az API kliens szimulálása (Mockolás)
vi.mock('@/api/axiosClient', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() }
    }
  }
}));

describe('SportStore CRUD műveletek', () => {
  beforeEach(() => {
    setActivePinia(createPinia()); // Minden teszt előtt tiszta Pinia kell
    vi.clearAllMocks(); // Töröljük az előző teszt hívásait
  });

  // READ teszt
  it('getAll - sikeresen lekéri a sportokat', async () => {
    const store = useSportStore();
    const mockSports = { data: [{ id: 1, sportNev: 'Kosárlabda' }] };
    apiClient.get.mockResolvedValue(mockSports);

    await store.getAll();

    expect(apiClient.get).toHaveBeenCalledWith('/sports');
    expect(store.items).toHaveLength(1);
    expect(store.items[0].sportNev).toBe('Kosárlabda');
  });

  // CREATE teszt
  it('create - új sportot ad hozzá és frissíti a listát', async () => {
    const store = useSportStore();
    const newSport = { sportNev: 'Tenisz' };
    
    // Szimuláljuk a sikeres mentést, majd a lista újratöltését
    apiClient.post.mockResolvedValue({ data: { id: 2, ...newSport } });
    apiClient.get.mockResolvedValue({ data: [{ id: 2, ...newSport }] });

    const success = await store.create(newSport);

    expect(success).toBe(true);
    expect(apiClient.post).toHaveBeenCalled();
    expect(store.items[0].sportNev).toBe('Tenisz');
  });

  // DELETE teszt speciális hibaágra (MySQL 1451)
  it('delete - kezeli a kényszerfeltétel hibát (1451)', async () => {
    const store = useSportStore();
    const errorResponse = {
      response: {
        status: 500,
        data: { message: "1451-es hiba üzenete" }
      }
    };
    
    apiClient.delete.mockRejectedValue(errorResponse);

    try {
      await store.delete(1);
    } catch (e) {
      // Az interceptorod dobja tovább, itt elkapjuk
    }

    expect(store.error).toBeDefined();
    expect(store.loading).toBe(false);
  });
});