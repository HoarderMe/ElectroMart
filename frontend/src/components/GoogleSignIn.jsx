import { GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const GoogleSignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      // Show loading toast
      const loadingToast = toast.loading('Signing in with Google...');

      const response = await axios.post('http://localhost:4000/api/oauth/google', {
        token: credentialResponse.credential
      });

      const { token, user } = response.data;

      // Store token in localStorage
      localStorage.setItem('token', token);

      // Set default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Update Redux store
      dispatch({
        type: 'auth/loginSuccess',
        payload: { token, user }
      });

      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success('Successfully signed in with Google!');

      // Redirect based on user role
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Google sign in failed:', error);
      const errorMessage = error.response?.data?.message || 'Failed to sign in with Google';
      toast.error(errorMessage);
      dispatch({
        type: 'auth/loginFailure',
        payload: errorMessage
      });
    }
  };

  const handleError = () => {
    const errorMessage = 'Google Sign In was unsuccessful';
    console.error(errorMessage);
    toast.error(errorMessage);
    dispatch({
      type: 'auth/loginFailure',
      payload: errorMessage
    });
  };

  return (
    <div className="w-full">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap
        theme="filled_blue"
        shape="rectangular"
        text="signin_with"
        width="100%"
        locale="en"
        context="signin"
        auto_select={false}
        cancel_on_tap_outside={true}
      />
    </div>
  );
};

export default GoogleSignIn; 