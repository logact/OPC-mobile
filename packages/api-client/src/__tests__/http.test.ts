import { describe, expect, it, vi } from 'vitest';
import axios from 'axios';
import { createHttpClient } from '../http.js';

vi.mock('axios');

describe('createHttpClient', () => {
  it('builds baseURL from config', () => {
    const create = vi.mocked(axios.create);
    create.mockReturnValue({
      get: vi.fn(),
      post: vi.fn(),
      patch: vi.fn(),
    } as unknown as ReturnType<typeof axios.create>);

    createHttpClient({ baseURL: 'https://opc.example.com/', apiVersion: 'v1' });

    // API_ROUTES 已包含 /api/v1 前缀，baseURL 只需服务器根地址
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: 'https://opc.example.com',
        timeout: 10000,
      }),
    );
  });
});
