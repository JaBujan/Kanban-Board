import { JwtPayload, jwtDecode } from 'jwt-decode';

class AuthService {
  getProfile() {
    const token = this.getToken();
    if (token) {
      try {
        return jwtDecode<JwtPayload>(token);
      } catch (e) {
        console.error('Error decoding token:', e);
        return null;
      }
    }
    return null;
  }

  loggedIn() {
    const token = this.getToken();
    // If there is a token and it's not expired, return `true`
    return token && !this.isTokenExpired(token) ? true : false;
  }

  isTokenExpired(token: string) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (decoded.exp && decoded.exp < Date.now() / 1000) {
        localStorage.removeItem('id_token');
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error decoding token for expiration check:', err);
      return true; // Treat errors in decoding as an expired token
    }
  }

  getToken(): string | null { // Modified to return string | null
    return localStorage.getItem('id_token');
  }

  login(idToken: string) {
    localStorage.setItem('id_token', idToken);
    window.location.assign('/');
  }

  logout() {
    localStorage.removeItem('id_token');
    window.location.assign('/login');
  }
}

export default new AuthService();
