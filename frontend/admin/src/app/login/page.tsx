import LoginForm from './components/LoginForm';
import { loginService } from '@/services/authen.service';
import { onResponseFullfillType } from '@/@types/axios.type';
import { loginInfo } from '@/@types/authen.type';

const Login = () => {
  const handleLogin = async (value: loginInfo): Promise<onResponseFullfillType> => {
    "use server";
    return loginService(value);

  }
  return (
    <LoginForm onLogin={handleLogin} />
  );
}

export default Login;