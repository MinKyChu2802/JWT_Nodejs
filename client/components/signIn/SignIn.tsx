import Background from 'components/background/Background'
import React, { FC, useRef, useState, ChangeEvent, useEffect } from 'react'
import {
  useRive,
  useStateMachineInput,
  Layout,
  Fit,
  Alignment,
  UseRiveParameters,
  RiveState,
  StateMachineInput,
} from 'rive-react'
import { useForm, Controller } from 'react-hook-form'
import axios from 'axios'
import { apiURL } from 'routes/apiURL'
import { useRouter } from 'next/router'
import { useStore } from 'store'

const STATE_MACHINE_NAME = 'Login Machine'
const LOGIN_TEXT = 'Login'

const SignIn: FC = (riveProps: UseRiveParameters = {}) => {
  const { control, handleSubmit } = useForm()
  const router = useRouter()
  const { update } = useStore()
  const { rive: riveInstance, RiveComponent }: RiveState = useRive({
    src: '/login-teddy.riv',
    stateMachines: STATE_MACHINE_NAME,
    autoplay: true,
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center,
    }),
    ...riveProps,
  })

  // const [userValue, setUserValue] = useState("");
  // const [passValue, setPassValue] = useState("");
  const [inputLookMultiplier, setInputLookMultiplier] = useState(0)
  const [loginButtonText, setLoginButtonText] = useState(LOGIN_TEXT)
  const inputRef = useRef(null)

  const isCheckingInput: StateMachineInput | null = useStateMachineInput(riveInstance, STATE_MACHINE_NAME, 'isChecking')
  const numLookInput: StateMachineInput | null = useStateMachineInput(riveInstance, STATE_MACHINE_NAME, 'numLook')
  const trigSuccessInput: StateMachineInput | null = useStateMachineInput(
    riveInstance,
    STATE_MACHINE_NAME,
    'trigSuccess'
  )
  const trigFailInput: StateMachineInput | null = useStateMachineInput(riveInstance, STATE_MACHINE_NAME, 'trigFail')
  const isHandsUpInput: StateMachineInput | null = useStateMachineInput(riveInstance, STATE_MACHINE_NAME, 'isHandsUp')

  // Divide the input width by the max value the state machine looks for in numLook.
  // This gets us a multiplier we can apply for each character typed in the input
  // to help Teddy track progress along the input line
  useEffect(() => {
    if (inputRef?.current && !inputLookMultiplier) {
      setInputLookMultiplier((inputRef.current as HTMLInputElement).offsetWidth / 100)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputRef])

  // When submitting, simulate password validation checking and trigger the appropriate input from the
  // state machine
  const onSubmit = (data: any) => {
    const { username, password } = data

    setLoginButtonText('Checking...')

    axios
      .post(
        `${process.env.NEXT_PUBLIC_SITE_URL_BE}${apiURL.signIn()}`,
        {
          username,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .then((response: any) => {
        localStorage.setItem('accessToken', response.data.accessToken)
        localStorage.setItem('refreshToken', response.data.refreshToken)
        setLoginButtonText('Done')
        trigSuccessInput!.fire()
        update(response.data)
        router.push('/admin/dashboard')
      })
      .catch((error) => {
        console.error(error)
        setLoginButtonText(LOGIN_TEXT)
        trigFailInput!.fire()
      })
  }

  return (
    <Background>
      <div className="login-form-component-root">
        <div className="login-form-wrapper">
          <div className="rive-wrapper">
            <RiveComponent className="rive-container" />
          </div>
          <div className="form-container">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mt-2">
                <Controller
                  render={({ field: { value, onChange } }) => (
                    <input
                      type="text"
                      className="form-username"
                      name="username"
                      placeholder="Username"
                      onFocus={() => {
                        isCheckingInput!.value = true
                        if (numLookInput!.value !== value.length * inputLookMultiplier) {
                          numLookInput!.value = value.length * inputLookMultiplier
                        }
                      }}
                      value={value}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        const newVal = e.target.value
                        if (!isCheckingInput!.value) {
                          isCheckingInput!.value = true
                        }
                        const numChars = newVal.length
                        numLookInput!.value = numChars * inputLookMultiplier
                        onChange(e)
                      }}
                      onBlur={() => (isCheckingInput!.value = false)}
                      ref={inputRef}
                    />
                  )}
                  control={control}
                  name="username"
                  defaultValue=""
                />
              </div>
              <div className="mt-2 mb-2">
                <Controller
                  render={({ field: { value, onChange } }) => (
                    <input
                      type="password"
                      className="form-pass"
                      name="password"
                      placeholder="Password"
                      value={value}
                      onFocus={() => (isHandsUpInput!.value = true)}
                      onBlur={() => (isHandsUpInput!.value = false)}
                      onChange={onChange}
                    />
                  )}
                  control={control}
                  name="password"
                  defaultValue=""
                />
              </div>
              <button className="login-btn">{loginButtonText}</button>
            </form>
          </div>
        </div>
      </div>
    </Background>
  )
}

export default SignIn
