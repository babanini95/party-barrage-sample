import { ChangeEvent, useState } from "react";
import { waas } from "../WaasConfig";
import { Box, TextInput } from "@0xsequence/design-system";

const WalletConnector = (props: { setSignIn: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const { setSignIn } = props;
    const [inputEmailState, setInputEmailState] = useState(true);
    const [email, setEmail] = useState<string>("");
    const [otpCode, setOtpCode] = useState<string>("");
    const [respondWithCode, setRespondWithCode] = useState<((code: string) => Promise<void>)>();

    waas.onEmailAuthCodeRequired(async (respondWithCode) => {
        console.log('OTP requested');
        setRespondWithCode(() => async (otpCode: string) => {
            try {
                await respondWithCode(otpCode); // Call the callback with the OTP
                console.log('OTP verified successfully');
            } catch (err) {
                console.error('OTP verification failed:', err);
            }
        });
    });

    const connectWaas = async () => {
        try {
            setEmail("");
            setInputEmailState(false);
            const emailResponse = await waas.signIn({ email }, "signIn");
            console.log(emailResponse);
            setSignIn(true);
        }
        catch (err) {
            setOtpCode("");
            setInputEmailState(true);
            console.error(err);
            setSignIn(false);
        }
    }

    const confirmOtp = async () => {
        if (!respondWithCode) {
            console.error('OTP callback is not set. Please start the sign-in process again.');
            return;
        }

        try {
            await respondWithCode(otpCode); // Use the stored callback
        } catch (err) {
            console.error('OTP verification failed:', err);
        }
    }

    const onChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setEmail(value);
    }

    const onChangeOtpCode = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setOtpCode(value);
    }

    return (
        <>
            <Box display="flex" flexDirection="column" gap="2" marginBottom="8">
                <p>Wallet Not connected</p>
                <p></p>
                {inputEmailState ?
                    <TextInput
                        name="Email"
                        controls="Email"
                        numeric={false}
                        onChange={onChangeEmail}
                    />
                    :
                    <TextInput
                        name="OTP"
                        controls="OTP"
                        numeric={false}
                        onChange={onChangeOtpCode}
                    />
                }
                <div className="card">
                    {inputEmailState ?
                        <button onClick={() => connectWaas()}>Connect</button>
                        :
                        <button onClick={() => confirmOtp()}>Confirm Otp</button>
                    }
                </div>
            </Box>
        </>
    )
}

export default WalletConnector;