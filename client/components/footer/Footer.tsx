import { NextPage } from 'next'
import React from 'react'
import Wrapper from 'components/wrapper/Wrapper'
import { TextField } from '@mui/material'
import { Button } from 'primereact/button'

const Footer: NextPage = () => {
  return (
    <div className="mx-auto w-full p-8 bg-neutral-500 mt-6 text-white ">
      <Wrapper title="Contact me">
        <div className="w-ful flex justify-around text-center">
          <Wrapper
            title="Follow me"
            isSmall
          >
            <div className="flex justify-between cursor-pointer">
              <i className="pi pi-facebook"></i>
              <i className="pi pi-instagram"></i>
              <i
                className="pi pi-github
"
              ></i>
            </div>
          </Wrapper>

          <Wrapper
            title=""
            isSmall
          >
            <form>
              <div className="flex justify-between gap-2">
                <TextField
                  label="Your e-mail"
                  variant="outlined"
                  color="warning"
                />
                <Button
                  onClick={(e) => {
                    e.preventDefault()
                  }}
                  className="p-button-sm  Submit-btn"
                >
                  Submit
                </Button>
              </div>
            </form>
          </Wrapper>

          <Wrapper
            title="Call me"
            isSmall
          >
            <a
              href="tel:0868280297"
              className="cursor-pointer"
            >
              Call 0868280297
            </a>
          </Wrapper>
        </div>
      </Wrapper>
    </div>
  )
}

export default Footer
