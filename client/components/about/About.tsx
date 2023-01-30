import { NextPage } from "next";
import Image from "next/image";
import React from "react";
import avatar from "assets/Minky.png";
import Content from "./Content";
import Wrapper from "components/wrapper/Wrapper";

const About: NextPage = () => {
  return (
    <div className=" bg-secondary p-5 w-full text-white rounded-md">
      <Wrapper title="About me">
        <div
          data-aos="fade-in"
          className="mt-8 flex justify-start items-start gap-10"
        >
          <Image src={avatar} alt="" width={300} height={500} />
          <Content />
        </div>
      </Wrapper>
    </div>
  );
};

export default About;
