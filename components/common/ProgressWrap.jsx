"use client";

import { useEffect, useState } from "react";

export default function ProgressWrap() {
  const [scrolled, setScrolled] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(500);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // You can use 'auto' or 'instant' as well
    });
  };

  const handleScroll = () => {
    if (document.querySelector("#scroll-top")) {
      const currentScroll =
        document.body.scrollTop || document.documentElement.scrollTop;
      setScrolled(currentScroll);
      if (currentScroll >= 150) {
        document.querySelector("#scroll-top").classList.add("active-progress");
      } else {
        document
          .querySelector("#scroll-top")
          .classList.remove("active-progress");
      }
      const totalScrollHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      setScrollHeight(totalScrollHeight);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div
        id="scroll-top"
        className="progress-wrap fixed w-[2.3rem] h-[2.3rem] cursor-pointer block shadow-[inset_0_0_0_0.1rem_rgba(128,130,134,0.25)] z-[1010] opacity-0 invisible translate-y-3 transition-all duration-[0.2s] ease-[linear,margin-right] delay-[0s] rounded-[100%] right-6 bottom-6 motion-reduce:transition-none after:absolute after:content-['\e951'] after:text-center after:leading-[2.3rem] after:text-[1.2rem] after:!text-[#3f78e0] after:h-[2.3rem] after:w-[2.3rem] after:cursor-pointer after:block after:z-[1] after:transition-all after:duration-[0.2s] after:ease-linear after:left-0 after:top-0 motion-reduce:after:transition-none after:font-Unicons"
        onClick={() => scrollToTop()}
      >
        {scrolled / scrollHeight ? (
          <svg
            className="progress-circle svg-content"
            width="100%"
            height="100%"
            viewBox="-1 -1 102 102"
          >
            <path
              className="fill-none stroke-[#3f78e0] stroke-[4] box-border transition-all duration-[0.2s] ease-linear motion-reduce:transition-none"
              d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98"
              style={{
                transition: "0s",
                strokeDasharray: "307.919, 307.919",
                strokeDashoffset: 307.919 - (scrolled / scrollHeight) * 307.919,
              }}
            />
          </svg>
        ) : (
          ""
        )}
      </div>
    </>
  );
}
