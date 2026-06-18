import { useAuth } from '../context/AuthContext.jsx';

const Home = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: 48, maxWidth: 560 }}>
     
  
     
      <h1 className="text-4xl font-bold text-blue-600">
     Home page of the website
      </h1>
   
     
    </div>
  );
};

export default Home;
