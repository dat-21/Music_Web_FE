# API Layer Standardization

Tai lieu nay mo ta cach API layer hoat dong trong FE, file nao la source of truth, va cach dung trong tung nhom file.

## 1. Tong Quan

FE dang theo mo hinh:

1. `src/lib/api.ts` tao va export mot API client dung chung.
2. API client nay khong tra ve raw `AxiosResponse`.
3. Cac method `get/delete/post/put/patch` tra ve thang `ApiResponse<T>` da duoc typed.
4. Cac file `src/api/*.api.ts`, hooks, pages chi viec doc `result.data` thay vi `response.data.data`.

Muc tieu la:

- giam duplicate axios config
- lam response shape ro rang hon
- typing de doc va de reuse
- khong phai lan qua nhieu file trung gian

## 2. Source Of Truth

- API client duy nhat: [src/lib/api.ts](src/lib/api.ts)
- Contract response va endpoint: [src/contracts.ts](src/contracts.ts)
- File trung gian cu `src/api/axiosConfig.ts` da bi xoa

## 3. Cach Hoat Dong

`src/lib/api.ts` dong vai tro wrapper typed cho axios:

1. Tao `rawApi` bang `axios.create(...)`.
2. Lay ra cac method goc `get/delete/post/put/patch`.
3. Wrapper cac method nay de unwrap `response.data`.
4. Tra ve `Promise<ApiResponse<T>>` cho GET/DELETE.
5. Tra ve `Promise<ApiResponse<TResponse>>` cho POST/PUT/PATCH, voi body co type rieng `TBody`.

Vi du usage:

```ts
const result = await api.get<SongListPayload>(API_ENDPOINTS.songs.list)
const songs = result.data?.songs ?? []

const created = await api.post<User, CreateUserDto>('/users', payload)
```

## 4. Ky Vong Ve Typing

GET/DELETE:

```ts
api.get<UserDTO>('/users/me')
api.delete<void>('/history/clear')
```

POST/PUT/PATCH:

```ts
api.post<User, CreateUserDto>('/users', payload)
api.put<User, UpdateUserDto>('/users/1', payload)
api.patch<User, Partial<UpdateUserDto>>('/users/1', payload)
```

Quy tac:

- `TResponse` la kieu du lieu tra ve trong `result.data`
- `TBody` la kieu payload gui len server
- khong can dung `unknown` neu da biet shape cua body

## 5. File Nao Dang Dung API Client Nay

Cac file sau import truc tiep tu [src/lib/api.ts](src/lib/api.ts):

- [src/api/song.api.ts](src/api/song.api.ts)
- [src/api/playlist.api.ts](src/api/playlist.api.ts)
- [src/api/history.api.ts](src/api/history.api.ts)
- [src/api/auth.api.ts](src/api/auth.api.ts)
- [src/api/admin.api.ts](src/api/admin.api.ts)
- [src/hooks/queries/useSongs.ts](src/hooks/queries/useSongs.ts)
- [src/hooks/queries/usePlaylists.ts](src/hooks/queries/usePlaylists.ts)
- [src/hooks/queries/useAdmin.ts](src/hooks/queries/useAdmin.ts)
- [src/hooks/queries/useChatbot.ts](src/hooks/queries/useChatbot.ts)

Cac file UI/service nay nhan du lieu da unwrap tu API layer:

- [src/hooks/queries/useAuth.ts](src/hooks/queries/useAuth.ts)
- [src/services/auth.service.ts](src/services/auth.service.ts)
- [src/pages/ArtistPage.tsx](src/pages/ArtistPage.tsx)
- [src/pages/LibraryPage.tsx](src/pages/LibraryPage.tsx)
- [src/pages/PlaylistDetailPage.tsx](src/pages/PlaylistDetailPage.tsx)
- [src/pages/SearchPage.tsx](src/pages/SearchPage.tsx)
- [src/pages/song/SongDetail.tsx](src/pages/song/SongDetail.tsx)
- [src/pages/admin/AdminSongs.tsx](src/pages/admin/AdminSongs.tsx)
- [src/pages/admin/AdminUpload.tsx](src/pages/admin/AdminUpload.tsx)

## 6. File Nao Van Dung Axios Rieng

Khong phai file nao cung dung chung API client nay. Hien tai van con 2 truong hop dung axios rieng:

- [src/utils/apiError.utils.ts](src/utils/apiError.utils.ts): chi dung `axios.isAxiosError(...)` de nhan dien loi
- [src/services/chatbot.service.ts](src/services/chatbot.service.ts): van tao instance rieng vi flow chatbot co base URL/shape rieng

Neu muon hop nhat chatbot service, can kiem tra lai base URL va response shape truoc khi doi.

## 7. Quy Tac Bat Buoc Cho Code Moi

- Luon import API client tu `@/lib/api`
- Khong import `axiosConfig` nua
- Khong tao axios instance moi neu endpoint do co the dung client chung
- Khong dung `response.data.data`
- Typing body va response ro rang:
  - `api.post<User, CreateUserDto>(...)`
  - `api.get<PlaylistPayload>(...)`

## 8. Error Handling

- API client khong nuot loi, error van bi reject len call site.
- Cac file can message lop cao hon co the dung `withApiError(...)` trong [src/utils/apiError.utils.ts](src/utils/apiError.utils.ts).
- UI co the doc `error.response?.data?.message` neu backend tra message theo `ApiResponse`.

## 9. Example End To End

### API module

```ts
export const getMyPlaylistsApi = () =>
  api.get<LibraryPayload>(API_ENDPOINTS.playlist.mine)
```

### Hook

```ts
const res = await getMyPlaylistsApi()
return res.data?.playlists ?? []
```

### Page

```ts
const response = await getAllSongsApi()
setCatalog(response.data?.songs ?? [])
```

## 10. Migration Checklist

- [ ] Import tu `@/lib/api`
- [ ] Khong con `axiosConfig`
- [ ] Khong co `response.data.data`
- [ ] POST/PUT/PATCH dung `post<TResponse, TBody>()`
- [ ] Build pass: `npm run build`

## 11. Ghi Chu

- Tai lieu nay mo ta trang thai hien tai cua FE sau MFE-11.
- Neu thay doi format response backend, file can cap nhat truoc tien la [src/lib/api.ts](src/lib/api.ts).
