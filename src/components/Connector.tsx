import { useOpenConnectModal } from "@0xsequence/kit";
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../FirebaseConfig';
import { Box } from '@0xsequence/design-system';

const Connector = () => {
  const { setOpenConnectModal } = useOpenConnectModal();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(false);

  const handleSignIn = () => {
    if (auth.currentUser) {
      setIsFirebaseConnected(true);
    } else {
      if (email.length < 4) {
        alert('Please enter an email address.');
        return;
      }
      if (password.length < 4) {
        alert('Please enter a password.');
        return;
      }
      // Sign in with email and pass.
      signInWithEmailAndPassword(auth, email, password).
        then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          setIsFirebaseConnected(true);
          // ...
          console.log('user: ', user.getIdToken());
          console.log("auth.currentUser: ", auth.currentUser);
        }).
        catch(function (error) {
          setIsFirebaseConnected(false);
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
          } else {
            alert(errorMessage);
          }
          console.log(error);
        });
    }


  }

  return (
    <>
      {!isFirebaseConnected ?
        <Box display="flex" flexDirection="column" gap="2" marginBottom="8">
          <label id="email">Email: </label>
          <input
            id="email"
            type='text'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <label id="pass">Enter password: </label>
          <input
            id="pass"
            type={
              showPassword ? "text" : "password"
            }
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />
          <label id="check">Show Password</label>
          <input
            id="check"
            type="checkbox"
            checked={showPassword}
            onChange={() =>
              setShowPassword((prev) => !prev)
            }
          />
          <button
            onClick={handleSignIn}
          >
            Sign in Firebase
          </button>
        </Box>
        :
        <Box display="flex" flexDirection="column" gap="2" marginBottom="8">
          <p>Wallet Not connected</p>
          <div className="card">
            <button onClick={() => setOpenConnectModal(true)}>Connect</button>
          </div>
        </Box>
      }
    </>
  );
};

export default Connector;
