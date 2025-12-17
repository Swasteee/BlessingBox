import { useAdmin } from '../context/AdminContext';
import AdminLogin from '../pages/AdminLogin';

const AdminRoute = ({ children }) => {
  const { isAdmin } = useAdmin();

  if (!isAdmin) {
    return <AdminLogin />;
  }

  return children;
};

export default AdminRoute;

