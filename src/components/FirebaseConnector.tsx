import { auth } from '../FirebaseConfig';
import {
  signInWithEmailAndPassword,
  signOut,
  // connectAuthEmulator,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { Box } from '@0xsequence/design-system';
import { useState } from 'react';

//const firebaseApp: FirebaseApp | undefined = initializeApp(firebaseConfig);

const FirebaseConnector = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  // if (window.location.hostname === 'localhost') {
  //   connectAuthEmulator(auth, 'http://localhost/:4445');
  // }

  function toggleSignIn() {
    if (auth.currentUser) {
      signOut(auth);
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
          // ...
          console.log('user: ', user.getIdToken());
        }).
        catch(function (error) {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
          } else {
            alert(errorMessage);
          }
          console.log(error);
          // disable button
        });
    }
  }

  function handleSignUp() {
    if (email.length < 4) {
      alert('Please enter an email address.');
      return;
    }
    if (password.length < 4) {
      alert('Please enter a password.');
      return;
    }
    // Create user with email and pass.
    createUserWithEmailAndPassword(auth, email, password).
      catch(function (error) {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode == 'auth/weak-password') {
          alert('The password is too weak.');
        } else {
          alert(errorMessage);
        }
        console.log(error);
      });
  }

  return (
    <>
      {/* {<Box display="flex" flexDirection="column" gap="2" marginBottom="8">
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
          onClick={handleSignUp}
        >
          Sign Up Firebase
        </button>
      </Box>} */}
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
          onClick={toggleSignIn}
        >
          Sign in Firebase
        </button>
      </Box>
    </>
  );
}

export default FirebaseConnector;