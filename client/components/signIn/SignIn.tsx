import BackGround from "components/background/Background";

import React, {
  FC,
  useRef,
  useState,
  ChangeEvent,
  SyntheticEvent,
  useEffect,
} from "react";

import {
  useRive,
  useStateMachineInput,
  Layout,
  Fit,
  Alignment,
  UseRiveParameters,
  RiveState,
  StateMachineInput,
} from "rive-react";

const STATE_MACHINE_NAME = "Login Machine";
const LOGIN_PASSWORD = "teddy";
const LOGIN_TEXT = "Login";

const SignIn: FC = (riveProps: UseRiveParameters = {}) => {
  const { rive: riveInstance, RiveComponent }: RiveState = useRive({
    src: "/login-teddy.riv",
    stateMachines: STATE_MACHINE_NAME,
    autoplay: true,
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center,
    }),
    ...riveProps,
  });

  const [userValue, setUserValue] = useState("");
  const [passValue, setPassValue] = useState("");
  const [inputLookMultiplier, setInputLookMultiplier] = useState(0);
  const [loginButtonText, setLoginButtonText] = useState(LOGIN_TEXT);
  const inputRef = useRef(null);

  const isCheckingInput: StateMachineInput | null = useStateMachineInput(
    riveInstance,
    STATE_MACHINE_NAME,
    "isChecking"
  );
  const numLookInput: StateMachineInput | null = useStateMachineInput(
    riveInstance,
    STATE_MACHINE_NAME,
    "numLook"
  );
  const trigSuccessInput: StateMachineInput | null = useStateMachineInput(
    riveInstance,
    STATE_MACHINE_NAME,
    "trigSuccess"
  );
  const trigFailInput: StateMachineInput | null = useStateMachineInput(
    riveInstance,
    STATE_MACHINE_NAME,
    "trigFail"
  );
  const isHandsUpInput: StateMachineInput | null = useStateMachineInput(
    riveInstance,
    STATE_MACHINE_NAME,
    "isHandsUp"
  );

  // Divide the input width by the max value the state machine looks for in numLook.
  // This gets us a multiplier we can apply for each character typed in the input
  // to help Teddy track progress along the input line
  useEffect(() => {
    if (inputRef?.current && !inputLookMultiplier) {
      setInputLookMultiplier(
        (inputRef.current as HTMLInputElement).offsetWidth / 100
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputRef]);

  // As the user types in the username box, update the numLook value to let Teddy know
  // where to look to according to the state machine
  const onUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setUserValue(newVal);
    if (!isCheckingInput!.value) {
      isCheckingInput!.value = true;
    }
    const numChars = newVal.length;
    numLookInput!.value = numChars * inputLookMultiplier;
  };

  // Start Teddy looking in the correct spot along the username input
  const onUsernameFocus = () => {
    isCheckingInput!.value = true;
    if (numLookInput!.value !== userValue.length * inputLookMultiplier) {
      numLookInput!.value = userValue.length * inputLookMultiplier;
    }
  };

  // When submitting, simulate password validation checking and trigger the appropriate input from the
  // state machine
  const onSubmit = (e: SyntheticEvent) => {
    setLoginButtonText("Checking...");
    setTimeout(() => {
      setLoginButtonText(LOGIN_TEXT);
      passValue === LOGIN_PASSWORD
        ? trigSuccessInput!.fire()
        : trigFailInput!.fire();
    }, 1500);
    e.preventDefault();
    return false;
  };

  return (
    <BackGround>
      <div className="login-form-component-root">
        <div className="login-form-wrapper">
          <div className="rive-wrapper">
            <RiveComponent className="rive-container" />
          </div>
          <div className="form-container">
            <form onSubmit={onSubmit}>
              <div className="mt-2">
                <input
                  type="text"
                  className="form-username"
                  name="username"
                  placeholder="Username"
                  onFocus={onUsernameFocus}
                  value={userValue}
                  onChange={onUsernameChange}
                  onBlur={() => (isCheckingInput!.value = false)}
                  ref={inputRef}
                />
              </div>
              <div className="mt-2 mb-2">
                <input
                  type="password"
                  className="form-pass"
                  name="password"
                  placeholder="Password (shh.. it's 'teddy')"
                  value={passValue}
                  onFocus={() => (isHandsUpInput!.value = true)}
                  onBlur={() => (isHandsUpInput!.value = false)}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setPassValue(e.target.value)
                  }
                />
              </div>
              <button className="login-btn">{loginButtonText}</button>
            </form>
          </div>
        </div>
      </div>
    </BackGround>
  );
};

export default SignIn;