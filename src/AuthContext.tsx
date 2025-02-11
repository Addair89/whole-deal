import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface Customer {
  source: string;
  id: number;
  company_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  password_hash: string;
  created_at: string;
}

interface AuthContextProps {
  customer: Customer | null;
  setCustomer: (customer: Customer | null) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  customer: null,
  setCustomer: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [customer, setCustomer] = useState<Customer | null>(() => {
    const savedCustomer = localStorage.getItem("customer");
    try {
      return savedCustomer ? JSON.parse(savedCustomer) : null;
    } catch (error) {
      console.error("Failed to parse customer from localStorage", error);
      return null;
    }
  });

  useEffect(() => {
    if (customer) {
      localStorage.setItem("customer", JSON.stringify(customer));
      console.log("Auth Context Updated:", customer);
    } else {
      localStorage.removeItem("customer");
      console.log("Auth Context NOT Updated:", customer);
    }
  }, [customer]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("customer");
    setCustomer(null);
  };

  return (
    <AuthContext.Provider value={{ customer, setCustomer, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
