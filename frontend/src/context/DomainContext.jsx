import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const DomainContext = createContext();

export const DOMAINS = [
  { id: 'www', name: 'www.payshield.com', label: 'Corporate Site', badge: 'Public Web', color: 'border-cyan-500 text-cyan-400', path: '/' },
  { id: 'customer', name: 'customer.payshield.com', label: 'Customer Portal', badge: 'Client Portal', color: 'border-emerald-500 text-emerald-400', path: '/customer' },
  { id: 'pay', name: 'pay.payshield.com', label: 'Payment Sandbox', badge: 'Sandbox App', color: 'border-amber-500 text-amber-400', path: '/pay' },
  { id: 'admin', name: 'admin.payshield.com', label: 'Admin SOC Portal', badge: 'Admin Gateway', color: 'border-purple-500 text-purple-400', path: '/admin' },
  { id: 'api', name: 'api.payshield.com', label: 'API Services Engine', badge: 'REST API', color: 'border-blue-500 text-blue-400', path: '/developers' },
  { id: 'lab', name: 'security-lab.payshield.com', label: 'Security Testing Lab', badge: 'Live Lab', color: 'border-rose-500 text-rose-400', path: '/security-lab' }
];

export function DomainProvider({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeDomain, setActiveDomain] = useState(DOMAINS[0]);

  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath.startsWith('/customer')) {
      setActiveDomain(DOMAINS[1]);
    } else if (currentPath.startsWith('/pay')) {
      setActiveDomain(DOMAINS[2]);
    } else if (currentPath.startsWith('/admin')) {
      setActiveDomain(DOMAINS[3]);
    } else if (currentPath.startsWith('/security-lab')) {
      setActiveDomain(DOMAINS[5]);
    } else {
      setActiveDomain(DOMAINS[0]);
    }
  }, [location.pathname]);

  const switchDomain = (domainId) => {
    const target = DOMAINS.find(d => d.id === domainId);
    if (target) {
      setActiveDomain(target);
      navigate(target.path);
    }
  };

  return (
    <DomainContext.Provider value={{ activeDomain, switchDomain, DOMAINS }}>
      {children}
    </DomainContext.Provider>
  );
}

export function useDomain() {
  return useContext(DomainContext);
}
