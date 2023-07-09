import React from "react";
import { motion } from "framer-motion";
function Medorien({ bgAnimation, detailsLogo, mainLogo, lightsAnimation }) {
  return (
    <div className="flag">
      <motion.svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 590.9 742.56">
        <g isolation="isolate">
          <g id="_Layer" data-name="Layer">
            <motion.g
              id="bg"
              variants={bgAnimation}
              initial="init"
              animate="visible"
            >
              <polygon
                points="544.54 41.63 544.54 590.14 295.15 742.56 46.36 589.17 46.25 41.63 544.54 41.63"
                fill="#424242"
              />
            </motion.g>
            <motion.g
              id="details"
              variants={detailsLogo}
              initial="init"
              animate="visible"
            >
              <g>
                <path
                  d="M286.65,585.6s.11,.07,.16,.11c1.71-.64,3.52-1.09,5.4-1.3-1.12-.91-2.25-1.64-3.27-2.31-2.58-1.68-3.93-2.64-4.18-4.57-.35-2.59,1.34-7.07,11.34-13.65l-2.3-3.49c-9.61,6.32-13.93,12.11-13.19,17.69,.51,3.92,3.32,5.75,6.04,7.52Z"
                  fill="#f69f04"
                />
                <path
                  d="M303.33,629.12c-1.7,.66-3.5,1.12-5.37,1.36,1.03,.8,2.05,1.47,3,2.08,2.57,1.69,3.93,2.65,4.18,4.59,.34,2.6-1.36,7.08-11.34,13.65l2.3,3.49c9.6-6.32,13.92-12.1,13.19-17.68-.51-3.9-3.27-5.73-5.96-7.49Z"
                  fill="#f69f04"
                />
                <path
                  d="M265.74,621.63c3.4-.67,5.1-3.3,6.75-5.85,.16-.24,.31-.49,.47-.73-.6-1.72-1-3.54-1.18-5.42-1.14,1.3-2.02,2.65-2.81,3.88-1.52,2.36-2.46,3.7-4.04,4.01-3.23,.64-8.05-3.4-13.58-11.37l-3.44,2.38c6.17,8.89,11.52,13.24,16.32,13.24,.51,0,1.01-.04,1.51-.14Z"
                  fill="#f69f04"
                />
                <path
                  d="M324.18,593.05c-3.48,.64-5.19,3.3-6.84,5.86-.16,.25-.32,.49-.48,.74,.61,1.71,1.03,3.51,1.22,5.38,1.13-1.3,2-2.64,2.78-3.85,1.52-2.37,2.46-3.72,4.08-4.02,3.26-.61,8.1,3.44,13.61,11.37l3.43-2.38c-6.78-9.78-12.61-14.06-17.8-13.1Z"
                  fill="#f69f04"
                />
                <path
                  d="M264.06,596.76c3.15,2.43,6.44,1.75,9.63,1.1,.03-.01,.06-.01,.09-.02,.77-1.69,1.74-3.28,2.89-4.72-1.39,.15-2.66,.41-3.82,.64-3.03,.62-4.68,.89-6.24-.31-2.08-1.61-4.06-5.97-1.66-17.66l-4.1-.84c-2.31,11.24-1.26,18.38,3.21,21.81Z"
                  fill="#f69f04"
                />
                <path
                  d="M325.84,617.92c-3.13-2.43-6.41-1.8-9.58-1.17-.73,1.68-1.67,3.26-2.77,4.71,1.26-.15,2.42-.38,3.49-.59,3.06-.61,4.72-.86,6.29,.36,3,2.32,3.58,8.43,1.67,17.65l4.1,.85c2.31-11.21,1.27-18.34-3.2-21.81Z"
                  fill="#f69f04"
                />
                <path
                  d="M284.73,628.31c-1.68-.82-3.24-1.83-4.66-3.02,.1,1.81,.47,3.46,.8,4.94,.61,2.74,.91,4.35,0,5.67-1.85,2.69-8.09,3.18-17.57,1.35l-.79,4.11c4.02,.78,7.51,1.16,10.47,1.16,5.64,0,9.39-1.41,11.34-4.25,1.98-2.88,1.3-5.97,.63-8.95-.07-.33-.15-.67-.22-1.01Z"
                  fill="#f69f04"
                />
                <path
                  d="M304.92,586.49c1.69,.8,3.27,1.8,4.71,2.98-.12-1.68-.47-3.22-.78-4.6-.6-2.68-.89-4.25-.02-5.59,1.82-2.79,8.15-3.45,17.82-1.84l.68-4.13c-11.9-1.98-19.11-.77-22.01,3.68-1.88,2.89-1.2,5.89-.55,8.8,.05,.23,.1,.47,.15,.7Z"
                  fill="#f69f04"
                />
                <path
                  d="M308.09,597.53c-.91-1.21-1.98-2.28-3.18-3.19-2.15-1.65-4.71-2.77-7.5-3.18-.8-.13-1.62-.19-2.46-.19-.77,0-1.52,.05-2.26,.16-2.8,.38-5.36,1.46-7.52,3.06-1.27,.94-2.4,2.06-3.36,3.33-1.61,2.15-2.71,4.71-3.1,7.51-.11,.75-.17,1.52-.17,2.31,0,.74,.05,1.47,.15,2.18,.37,2.82,1.46,5.42,3.09,7.59,.9,1.2,1.95,2.27,3.13,3.18,2.16,1.67,4.76,2.82,7.59,3.24,.8,.12,1.62,.18,2.45,.18,.77,0,1.53-.05,2.27-.16,2.81-.38,5.39-1.48,7.56-3.1,1.27-.95,2.4-2.08,3.34-3.35,1.59-2.13,2.68-4.67,3.07-7.43,.11-.76,.17-1.54,.17-2.33,0-.74-.05-1.48-.15-2.19-.38-2.84-1.49-5.44-3.12-7.62Z"
                  fill="#f69f04"
                />
              </g>
              <g>
                <path
                  d="M155.09,471.08c0-14.33,11.71-26.16,26.88-27.97-1.32-.16-2.66-.25-4.03-.25-17.07,0-30.91,12.63-30.91,28.21s13.84,28.21,30.91,28.21c1.37,0,2.71-.09,4.03-.25-15.16-1.8-26.88-13.63-26.88-27.97Z"
                  fill="#f69f04"
                  stroke="#f69f04"
                  stroke-miterlimit="10"
                  stroke-width=".84"
                />
                <g>
                  <polygon
                    points="442.98 466.12 430.47 477.6 432.86 494.39 418.04 486.07 402.77 493.52 406.13 476.9 394.3 464.72 411.19 462.76 419.15 447.78 426.23 463.2 442.98 466.12"
                    fill="none"
                    stroke="#f69f04"
                    stroke-miterlimit="10"
                    stroke-width="4.19"
                  />
                  <polygon
                    points="435.4 452.8 432.05 469.42 443.87 481.6 426.99 483.55 419.03 498.54 411.95 483.12 395.2 480.2 407.71 468.72 405.32 451.93 420.13 460.25 435.4 452.8"
                    fill="none"
                    stroke="#f69f04"
                    stroke-miterlimit="10"
                    stroke-width="4.19"
                  />
                </g>
              </g>
            </motion.g>
            <motion.g
              id="main"
              variants={mainLogo}
              initial="init"
              animate="visible"
            >
              <g>
                <path
                  d="M305.11,230.33c-.22,.11-.45,.23-.67,.34,0-.02,0-.03,.01-.05,.22-.17,.43-.33,.65-.51,0,.07,.01,.14,.01,.22Z"
                  fill="#f69f04"
                />
                <g>
                  <path
                    d="M289.99,197.34s-.07,.03-.11,.05c-.05-.05-.1-.09-.15-.13,.09,.02,.18,.05,.26,.08Z"
                    fill="#f69f04"
                  />
                  <path
                    d="M289.99,197.34s-.07,.03-.11,.05c-.05-.05-.1-.09-.15-.13,.09,.02,.18,.05,.26,.08Z"
                    fill="#f69f04"
                  />
                  <path
                    d="M319.75,182.38c-.1,.05-.19,.1-.29,.15,.04-.11,.08-.22,.12-.32,.06,.06,.12,.12,.17,.17Z"
                    fill="#f69f04"
                  />
                  <path
                    d="M349.31,191.78c-11.92-6.28-23.49-6.22-31.08-5.1,.36-1.71,.81-3.05,1.23-4.15,.04-.11,.08-.22,.12-.32,.91-2.3,1.63-3.49,.99-4.8-.18-.37-.47-.73-.82-1.07l-.19-.19s-.02-.01-.03-.02c-5.13-5.02-16.95-15.08-34.89-18.55-31.6-6.11-55.67,13.35-59.2,16.31,.49-.18,8.43-3.05,14.78-3.52-8.04,4.03-13.31,8.33-14.8,9.57,0,0,11.43-4.22,18.09-3.51-10.82,4.77-19.18,9.25-23.56,5.67-.76-.62-3.01-2.8-3.36-2.5-.46,.39,2.59,4.65,3.05,5.28,5.3,7.14,19.59,6.49,34.71,6.8-2.63,4.47-3.63,10.26-4.01,14.15h0c-.6,3.27-1.1,7.24-1.16,11.76,0,0-.06,4.93,.46,8.91,1.13,8.55,8.81,23.83,23.56,31.35,21.74,11.08,52.48,2.05,56.6,10.7,.36,.76,1.02,2.72,1.22,2.67,.44-.09,.36-5.94-3.36-10.96-.68-.93-1.36-1.64-1.86-2.14-11.35-1.72-33.32,1.68-49.57-7.1,0,0-2.8-1.85-6.49-5.51,13.18,8.06,24.39,9.72,47.88,10.26,.99,.02,7.59,.14,7.89-1.37,.25-1.26-4.07-2.39-9.71-6.66-1.78-1.35-5.47-4.15-7.79-7.77-2.09-3.27-2.75-6.71-2.9-9.64-.22,.11-.45,.23-.67,.34,0-.02,0-.03,.01-.05,.22-.17,.43-.33,.65-.51,0,.07,.01,.14,.01,.22,7.09-3.54,17.96-7.93,31.87-9.72,16.04-2.06,29.22,.22,37.26,2.26-.82-3.02-6.09-21.17-24.93-31.09Zm-59.43,5.61s-.1-.09-.15-.13c.09,.02,.18,.05,.26,.08-.04,.01-.07,.03-.11,.05Zm3.02-12.75v-12.09l17.74,12.09h-17.74Z"
                    fill="#f69f04"
                  />
                  <path
                    d="M305.11,230.33c-.22,.11-.45,.23-.67,.34,0-.02,0-.03,.01-.05,.22-.17,.43-.33,.65-.51,0,.07,.01,.14,.01,.22Z"
                    fill="#f69f04"
                  />
                </g>
              </g>
              <path
                d="M478.23,357.74c-10.75,11.69-23.08,21.73-36.53,29.62-14.72,8.7-30.66,14.68-47.15,18.28,.84,4.12,1.44,8.34,1.75,12.62,17.54-5.84,34.15-14.24,49.01-25.52,12.97-9.79,24.28-21.49,33.64-34.4l-.72-.6Zm-12.78,30.45c-11.9,10.52-25.22,19.22-39.42,25.68-9.52,4.37-19.38,7.67-29.46,10.01,.01,.68,.03,1.38,.03,2.08,0,2.97-.13,5.9-.39,8.8,11.43-3.84,22.45-8.86,32.85-15.17,13.92-8.39,26.39-18.85,37.05-30.72l-.66-.68Zm-338.04-30.43s-.72,.59-.73,.59c17.56,24.88,41.5,42.82,68.48,54.41,.48-3.64,1.14-7.22,2.01-10.72-26.56-8.23-50.87-23.55-69.76-44.28Zm67.09,61.99c-19.9-6.72-38.49-17.43-54.31-31.54l-.67,.68c15.44,17.64,34.21,30.81,54.81,39.91-.02-.95-.03-1.89-.03-2.84,0-2.08,.07-4.17,.2-6.21Z"
                fill="#f69f04"
              />
              <path
                d="M484.96,306.72c-18.8,39.67-52.75,71.46-92.98,89.03-12.87-40.98-51.21-70.7-96.53-70.7s-83.71,29.76-96.56,70.77c-36.12-16.05-67.6-43.53-86.53-76.91-2.32-3.97-4.46-8.05-6.42-12.19l.81-.49c17.75,24.06,40.42,44.45,66.32,59.17-26.75-20.93-44.76-50.43-52.74-84.56-8.65-19.99-11.05-42.69-9.53-64.35,.75-10.48,2.38-20.81,4.77-30.93l.93,.17c-1.42,13.16-1.63,26.43-.26,39.52,5.21-69.13,46.39-139.15,115.16-158.64,15.28-4.25,31.31-6.09,47.04-5.57l.04,.95c-20.35,2.61-40.4,8.39-58.24,18.3-45.7,25.68-72.39,76.18-78.2,127.81,1.37-10.02,3.65-19.87,6.88-29.38,15.15-42.63,51.55-84.31,97.15-93.81,7.77-1.56,15.74-2.13,23.64-1.68l-.03,.94c-36.16-.64-68.3,22.18-88.77,50.56-21.1,28.19-31.44,63.28-28.76,98.26,3.1,46.47,25.58,89.99,62.05,113.83-14.71-10.81-27.45-24.26-37.12-39.77-19.46-30.88-25.9-69.44-19.34-105.06l.93,.15c-4.64,39.51,7.1,80.81,33.42,110.54-8.07-11.4-14.46-23.96-18.71-37.43-10.51-32.32-6.11-67.77,11.04-96.85,7.4-12.68,16.75-24.35,27.52-34.16l.68,.67c-14.93,17.28-26,37.89-30.58,60.25-.3,1.43-.56,2.86-.8,4.29,2.39-4.65,5.29-9.01,8.6-12.98l.76,.57c-5.22,7.5-8.87,16.05-10.7,24.96-1.15,26.27,7.99,50.88,23.61,70.91-4.19-7.93-6.9-16.63-7.8-25.5l.92-.2c3.65,10.91,9.88,20.71,18.38,28.32,1.47,1.31,2.99,2.53,4.57,3.68-10.69-13.52-16.84-30.99-14.25-48.22,.79-5.7,2.39-11.18,4.51-16.37l.9,.28c-3.49,15.5-1.07,31.1,7.59,43.95,8.38,12.1,20.43,20.6,33.86,26.14-6.27-3.18-11.77-8.11-15.34-14.01-2.6-4.15-4.36-8.71-5.32-13.34l.89-.32c6.22,11.69,16.77,20.88,30.09,22.83,8.86,1.45,17.99,1,27.16,2.71,1.7,.12,3.64,.34,5.78,.7,2.14-.36,4.08-.58,5.77-.7,9.18-1.71,18.32-1.26,27.17-2.71,13.31-1.95,23.86-11.14,30.09-22.83,.01,0,.89,.32,.89,.32-2.5,12.18-10.11,22.03-20.84,27.43,13.51-5.53,25.62-14.06,34.03-26.22,8.67-12.85,11.09-28.46,7.6-43.95l.9-.28c9.51,22.5,5.16,45.7-9.71,64.57,1.57-1.14,3.08-2.36,4.53-3.66,8.5-7.61,14.75-17.41,18.39-28.32l.92,.2c-.9,8.88-3.62,17.58-7.8,25.51,18.9-24.27,28.34-55.24,21.47-87.76-2.21-11.02-6.17-21.81-11.32-31.79-5.2-10.14-11.65-19.76-19.26-28.46l.68-.67c36.58,33.49,54.14,82.68,38.55,131.01-4.19,13.28-10.47,25.67-18.37,36.94,14.26-16.29,24.6-36.01,29.66-57.16,4.19-17.14,5.5-35.16,3.43-52.89l.93-.15c10.42,57.05-11.98,112.92-57.51,145.7,.04,.09,.1,.18,.14,.27,37.17-23.7,60.15-67.7,63.23-114.61,2.68-34.97-7.65-70.06-28.76-98.25-15.56-21.2-36.8-39.41-62.41-46.88-4.21-1.16-8.68-2.23-13.01-2.8-4.42-.6-8.87-.9-13.34-.87l-.04-.95c56.22-3.14,103.08,45.73,120.8,95.49,2.83,8.34,4.94,16.95,6.33,25.7-4.15-30.65-15.93-60.5-33.7-85.1-23.54-33.4-62.12-53.08-102.48-57.7l.05-.95c31.88-1.1,64.67,7.58,90.52,26.71,43.05,31.95,67.75,84.48,71.65,137.65,.32-2.94,.55-5.9,.71-8.86,.53-10.21,.19-20.54-.94-30.81l.93-.17c7.22,30.9,8.04,65.9-4.76,95.29-7.99,34.15-26.02,63.65-52.78,84.58,16.16-9.11,31.07-20.41,44.19-33.58,8-7.98,15.3-16.52,22.16-25.62l.82,.49Z"
                fill="#f69f04"
              />
              <path
                d="M295.39,295.52c-14.34,0-26.17-7.37-27.97-16.9-.16,.83-.25,1.67-.25,2.53,0,10.73,12.63,19.43,28.22,19.43s28.22-8.7,28.22-19.43c0-.86-.09-1.7-.25-2.53-1.8,9.53-13.63,16.9-27.97,16.9Z"
                fill="#f69f04"
              />
              <g>
                <path
                  d="M222.89,498.65l57.03,56.88c.07-6.71,.13-13.41,.2-20.12v-115.48c-15.97,.86-30.11,2.92-41.99,5.32v-27.3c10.09,4.17,26.82,9.74,48.17,10.87v41.03l8.62,19.79v-67.84h-3.59c-24.75-.67-43.42-8.52-52.91-13.27h.08c8.21,3.52,18.83,6.59,30.64,8.58,9.28,1.57,18.1,2.26,25.78,2.18v-64.16h-5.51c-8.04,1.53-25.69,6.03-42.19,20.66-19.71,17.47-25.67,38.64-27.46,46.39-.7,1.84-1.4,3.68-2.1,5.52v30.68c8.07,8.57,13.07,20.41,13.07,33.49,0,9.95-2.89,19.17-7.83,26.79Z"
                  fill="#f69f04"
                />
                <path
                  d="M373.97,407.8v30.68c-8.05,8.55-13.03,20.33-13.06,33.37v.11c0,9.95,2.89,19.17,7.82,26.79l-57.02,56.89c-.07-6.71-.14-13.41-.21-20.13v-114.05c7.71,.67,15.48,.94,23.23,.75,6.75,.91,13.03,1.98,18.77,3.14v-27.3c-10.08,4.17-26.82,9.74-48.16,10.87v11.91c-.93-.1-1.86-.22-2.78-.33-1.94,.26-3.89,.49-5.85,.69v-19.29h3.59c.78-.02,1.57-.05,2.34-.08,.75-.03,1.5-.07,2.23-.13,.53-.03,1.06-.07,1.6-.11,.68-.05,1.35-.1,2-.17,.56-.05,1.13-.1,1.68-.17,.43-.04,.86-.09,1.28-.15,.72-.08,1.42-.17,2.12-.26,.49-.06,.97-.14,1.45-.21,.38-.05,.74-.1,1.11-.17,1.25-.19,2.47-.4,3.67-.62,1.19-.23,2.36-.46,3.51-.71,1.35-.29,2.66-.59,3.95-.92,.61-.15,1.2-.3,1.79-.46,1.76-.46,3.47-.95,5.1-1.46,.54-.17,1.08-.33,1.61-.51,4.37-1.42,8.24-2.93,11.51-4.37,.37-.16,.72-.31,1.06-.47,.69-.3,1.35-.61,1.98-.91h.01c1.04-.49,2.01-.96,2.9-1.41h-.08c-.55,.24-1.13,.48-1.71,.71-.58,.24-1.17,.47-1.77,.7h-.01c-.95,.38-1.93,.73-2.93,1.08-.46,.17-.93,.32-1.41,.48-.17,.06-.34,.13-.52,.18-.54,.18-1.09,.35-1.64,.53-.37,.13-.74,.24-1.12,.34-.53,.17-1.09,.33-1.63,.49-.57,.18-1.16,.33-1.74,.5-.53,.15-1.08,.29-1.62,.44-1.14,.3-2.3,.6-3.48,.88-.58,.15-1.18,.28-1.77,.42-.58,.14-1.17,.26-1.75,.4-.04,0-.07,.01-.1,.02-.52,.11-1.05,.22-1.58,.33-1.91,.39-3.86,.75-5.85,1.09-9.29,1.57-18.11,2.27-25.78,2.19v-64.17h5.51c8.04,1.53,25.69,6.03,42.18,20.66,.62,.54,1.22,1.1,1.81,1.65,.45,.42,.89,.84,1.32,1.26,.21,.2,.41,.4,.61,.6,.31,.3,.61,.59,.88,.89,.29,.29,.57,.6,.86,.89,2.59,2.72,4.87,5.49,6.9,8.25,.31,.43,.63,.85,.92,1.27,.34,.49,.69,.97,1,1.45,.3,.43,.6,.87,.87,1.29,.26,.4,.51,.78,.76,1.18,.33,.52,.66,1.05,.97,1.59,.34,.55,.67,1.11,.98,1.66,.32,.55,.63,1.1,.92,1.65,.3,.54,.6,1.09,.87,1.62,.53,1.02,1.03,2.03,1.5,3.02,.82,1.74,1.54,3.41,2.18,5.01,.03,.06,.05,.13,.07,.18,.25,.64,.49,1.27,.72,1.88,.4,1.04,.75,2.05,1.06,3,.27,.84,.53,1.64,.76,2.4,.58,1.91,1.01,3.56,1.34,4.91,.06,.27,.13,.52,.18,.76,.03,.08,.06,.17,.09,.25,.42,1.1,.84,2.19,1.25,3.29,.25,.66,.5,1.32,.75,1.98Z"
                  fill="#f69f04"
                />
                <path
                  d="M302.56,420.51c.92,.11,1.85,.23,2.78,.33v29.11l-8.62,19.79v-48.55c1.95-.2,3.9-.43,5.85-.69Z"
                  fill="#f69f04"
                />
                <path
                  d="M333.92,422.1c.27,.04,.54,.07,.81,.11-7.75,.19-15.51-.08-23.23-.75v-1.43c1.99,.1,3.97,.23,5.91,.38,.97,.07,1.93,.15,2.88,.23,.96,.07,1.9,.17,2.84,.25,.64,.06,1.27,.13,1.9,.19,2.16,.21,4.28,.45,6.36,.71,.85,.1,1.69,.21,2.53,.31Z"
                  fill="#f69f04"
                />
                <path
                  d="M369.59,394.21c.28,.85,.53,1.64,.76,2.4-.23-.76-.49-1.57-.76-2.4Z"
                  fill="#f69f04"
                />
              </g>
            </motion.g>

            <g id="roll">
              <g>
                <rect
                  x="6.23"
                  y="6.98"
                  width="50.5"
                  height="32.12"
                  transform="translate(62.96 46.07) rotate(-180)"
                  fill="#848383"
                />
                <rect
                  x="5.91"
                  y="11.97"
                  width="50.83"
                  height="27.12"
                  transform="translate(62.64 51.07) rotate(-180)"
                  fill="#676766"
                  opacity=".4"
                />
                <path
                  d="M11.02,45.98c1.32,.42,2.72,.64,4.17,.64,8.39,0,15.19-7.5,15.19-16.74v-13.14C30.37,7.5,23.58,0,15.19,0c-1.45,0-2.85,.22-4.17,.64,6.37,1.99,11.02,8.45,11.02,16.1v13.14c0,7.65-4.65,14.1-11.02,16.1Z"
                  fill="#717070"
                />
                <path
                  d="M0,16.74v13.14c0,7.65,4.65,14.1,11.02,16.1,6.37-1.99,11.02-8.45,11.02-16.1v-13.14c0-7.65-4.65-14.1-11.02-16.1-2.52,.79-4.77,2.27-6.57,4.26C1.7,7.93,0,12.12,0,16.74Z"
                  fill="#848383"
                />
                <ellipse
                  cx="9.33"
                  cy="22.87"
                  rx="6.85"
                  ry="15.02"
                  fill="#969696"
                />
              </g>
              <g>
                <rect
                  x="534.17"
                  y="6.98"
                  width="50.5"
                  height="32.12"
                  fill="#848383"
                />
                <rect
                  x="534.17"
                  y="11.97"
                  width="50.83"
                  height="27.12"
                  fill="#676766"
                  opacity=".4"
                />
                <path
                  d="M579.89,45.98c-1.32,.42-2.72,.64-4.17,.64-8.39,0-15.19-7.5-15.19-16.74v-13.14C560.53,7.5,567.32,0,575.72,0,577.16,0,578.56,.22,579.89,.64c-6.37,1.99-11.02,8.45-11.02,16.1v13.14c0,7.65,4.65,14.1,11.02,16.1Z"
                  fill="#717070"
                />
                <path
                  d="M590.9,16.74v13.14c0,7.65-4.65,14.1-11.02,16.1-6.37-1.99-11.02-8.45-11.02-16.1v-13.14c0-7.65,4.65-14.1,11.02-16.1,2.52,.79,4.77,2.27,6.57,4.26,2.75,3.03,4.45,7.22,4.45,11.84Z"
                  fill="#848383"
                />
                <ellipse
                  cx="581.57"
                  cy="22.87"
                  rx="6.85"
                  ry="15.02"
                  fill="#969696"
                />
              </g>
              <path
                d="M292.45,42.07H48.31c-6.49,0-11.75-5.26-11.75-11.74v-14.03c0-6.49,5.26-11.75,11.75-11.75h244.58c-6.08,.43-10.88,5.49-10.88,11.7v14.17c0,6.04,4.57,11.02,10.44,11.65Z"
                fill="#424242"
              />
              <path
                d="M553.5,16.29v14.04c0,5.36-3.6,9.88-8.51,11.28-1.02,.29-2.11,.46-3.23,.46h-249.32c-.1-.01-.2-.03-.31-.05-.64-.08-1.28-.22-1.88-.41-4.77-1.48-8.24-5.93-8.24-11.2v-14.17c0-6.2,4.79-11.26,10.88-11.69h248.87c6.48,0,11.74,5.25,11.74,11.74Z"
                fill="#424242"
              />
            </g>
            <motion.g
              id="lights"
              variants={lightsAnimation}
              initial="init"
              animate="visible"
            >
              <polygon
                points="544.4 102.37 544.4 145.9 398.83 194.7 307.17 225.44 301.47 227.35 296.84 228.9 295.25 229.44 292.71 230.29 142.63 280.6 46 313.01 46 269.48 236.37 205.65 248.17 201.69 256.85 198.79 292.2 186.93 292.21 186.93 295.25 185.91 304.98 182.64 304.99 182.64 323.67 176.37 345.23 169.15 348.91 167.91 544.4 102.37"
                fill="#fff"
                mix-blend-mode="soft-light"
              />
              <polygon
                points="544.4 173.23 544.4 216.75 450.93 248.1 450.92 248.1 439.05 252.08 434.93 253.46 433.72 253.86 433.71 253.86 356.58 279.73 336.04 286.62 295.25 300.3 151.53 348.49 46 383.87 46 340.34 143.15 307.76 295.25 256.77 318.65 248.92 328.32 245.68 431.67 211.03 544.4 173.23"
                fill="#fff"
                mix-blend-mode="soft-light"
              />
              <polygon
                points="544.4 334.76 544.4 431.22 443.75 464.98 415.89 474.32 410.44 476.14 410.43 476.14 407.13 477.25 403.56 478.46 368.34 490.26 368.33 490.26 364.86 491.43 295.25 514.77 137.6 567.63 48.57 597.48 46 595.93 46 501.87 130.56 473.53 130.57 473.52 152.96 466.01 155.57 465.14 295.25 418.3 457.29 363.97 544.4 334.76"
                fill="#fff"
                mix-blend-mode="soft-light"
              />
              <path
                d="M295.25,42.19v-.12h-2.8c-.11-.01-.2-.02-.31-.04H46v11.82h498.4v-11.66h-249.15Z"
                fill="#282828"
              />
              <rect
                x="47.79"
                y="7.15"
                width="214.56"
                height="3.89"
                fill="#fff"
                mix-blend-mode="soft-light"
              />
              <rect
                x="370.73"
                y="8.27"
                width="165.09"
                height="2.22"
                fill="#fff"
                mix-blend-mode="soft-light"
              />
            </motion.g>
          </g>
        </g>
      </motion.svg>
    </div>
  );
}

export default Medorien;
