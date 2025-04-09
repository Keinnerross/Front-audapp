

interface AuthResponse {
    jwt: string;
    user: {
      id: number;
      username: string;
      email: string;
    };
    error?: {
      message: string;
    };
  }
  
  export async function authenticateUser(
    identifier: string,
    password: string
  ): Promise<AuthResponse> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/auth/local`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier,
          password,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Authentication failed");
      }
  
      const data: AuthResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Error in authenticateUser:", error);
      throw error;
    }
  }

  export function logOut(){
    localStorage.removeItem("user");
    localStorage.removeItem("jwt");
    window.location.href = "/signin"; 
  }

