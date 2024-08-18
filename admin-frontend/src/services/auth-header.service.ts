export function authHeader(): { [key: string]: string } {
  const token = localStorage.getItem("token");
  if (token) {
    return { "x-access-token": token };
  }
  return {};
}
