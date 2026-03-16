import api from '../index';
import useUserStore from '../../store/user';

interface UserInfoResult {
  message: string;
  data: {
    id: number;
    username: string;
    role: string;
    permissions: string[];
  };
}

export async function login(username: string, password: string) {
  await api.post('/login', { username, password });

  const res = await api.get('/current-user');
  
  const userInfoData = res.data; 
  console.log('userInfoData',userInfoData)

  useUserStore.getState().login({
    userInfo: {
      id: userInfoData.id,
      username: userInfoData.username,
      role: userInfoData.role,
    },
    
    permissions: userInfoData.permissions || [], 
  });
      localStorage.setItem('userInfo', JSON.stringify(res.data.userInfo));
    localStorage.setItem('permissions', JSON.stringify(res.data.permissions));


 return res.data as unknown as UserInfoResult;
}