import React from "react";
import { motion } from "framer-motion";
function Thornheim({ bgAnimation, detailsLogo, mainLogo, lightsAnimation }) {
  return (
    <div className="flag">
      <motion.svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 590.9 756.82">
        <g isolation="isolate">
          <g id="_Layer" data-name="Layer">
            <motion.g
              id="bg"
              variants={bgAnimation}
              initial="init"
              animate="visible"
            >
                <path d="M546.23,742.16c0,18.36-31.35-21.2-78.39,0-11.76-11.55-24.5,8.63-37.97-6.9-13.47-11.06-27.68-8.05-42.38,1.02-14.7,8.18-29.89,3.04-45.32,3.78-15.43-10.09-31.11,14.53-46.79,2.1-15.68-12.25-31.35,6.64-46.79,2.52-15.43,2.63-30.62,14.6-45.32,.54-14.7-20.17-28.91-3.22-42.38-1.68-13.47-10.07-26.21-.53-37.97-1.37-23.52-19.75-43.11-3.34-56.83-7.51-13.72,7.61-21.56,1.36-21.56,7.51V41.9h501.68V669.33c0,28.86,0,81.25,0,72.83Z" fill="#333233"/>
            </motion.g>
            <motion.g
              id="details"
              variants={detailsLogo}
              initial="init"
              animate="visible"
            >
        <g>
          <path d="M311.35,289.44v16.16c17.88,11.66,29.82,32.72,29.82,56.76s-11.94,45.1-29.82,56.76v16.16c25.49-12.94,43.12-40.72,43.12-72.92s-17.63-59.98-43.12-72.92Z" fill="none" stroke="#fdfdfd" stroke-miterlimit="10" stroke-width="7.41"/>
          <path d="M349.36,391.59c24.12-12.66,39-10.59,48-6.62,22.38,9.87,22.46,37.62,46.82,56.79,18.08,14.22,39.38,15.74,53.23,15.19" fill="none" stroke="#fdfdfd" stroke-miterlimit="10" stroke-width="7.41"/>
          <path d="M324.63,276.22c-7.34-27.66-2.79-42.95,2.47-51.73,13-21.71,38.55-16.78,60.55-39.19,15.45-15.73,21.08-36.67,23.35-52.62" fill="none" stroke="#fdfdfd" stroke-miterlimit="10" stroke-width="7.41"/>
          <path d="M223.25,403.99c-14.02-21.97-26.87-26.19-35.81-26.18-22.21,.03-34.08,26.2-61.83,34.2-20.59,5.93-38.38-1.48-49.28-7.75" fill="none" stroke="#fdfdfd" stroke-miterlimit="10" stroke-width="7.41"/>
          <path d="M409.65,134.75l-51.06,30.35,12.7-49.36c-23.72-8.98-49.24-13.89-75.84-13.89-94.15,0-174.94,61.26-209.46,148.56l7.28,16.09-11.53-4.5c-8.81,25.94-13.62,53.93-13.62,83.13,0,134.36,101.78,243.29,227.33,243.29,31.84,0,62.14-7.02,89.65-19.66v-33.91l14.38,26.66c73.23-40.4,123.3-122.13,123.3-216.37s-45.48-168.25-113.14-210.4Z" fill="none" stroke="#fdfdfd" stroke-miterlimit="10" stroke-width="7.41"/>
        </g>
            </motion.g>
            <motion.g
              id="main"
              variants={mainLogo}
              initial="init"
              animate="visible"
            >
        <g>
          <polygon points="212.37 234.22 212.37 275.97 193.58 299.16 196.47 266.69 184.91 275.97 212.37 216.82 212.37 234.22" fill="#fdfdfd"/>
          <polygon points="320.2 367.2 302.5 391.17 320.2 405.09 320.2 367.2" fill="#fdfdfd"/>
          <polygon points="215.26 284.86 320.02 424.42 192.14 311.92 215.26 284.86" fill="#fdfdfd"/>
          <polygon points="287.5 408.18 320.2 436.01 317.13 500.96 287.5 408.18" fill="#fdfdfd"/>
          <polygon points="184.91 284.86 142.29 293.75 192.14 241.95 179.13 265.92 171.91 279.65 184.91 284.86" fill="#fdfdfd"/>
          <polygon points="177.69 293.75 119.89 311.92 181.3 311.92 178.41 299.16 177.69 293.75" fill="#fdfdfd"/>
          <polygon points="184.91 316.95 142.29 386.14 311.35 555.85 287.5 442.97 287.5 492.45 263.66 389.62 260.05 458.44 245.96 436.4 256.08 477.76 161.8 381.12 184.91 322.36 184.91 316.95" fill="#fdfdfd"/>
          <polygon points="192.14 322.36 167.21 379.57 226.82 350.97 197.02 325.45 192.14 322.36" fill="#fdfdfd"/>
          <polygon points="303.85 485.5 320.2 550.44 308.46 485.5 303.85 485.5" fill="#fdfdfd"/>
          <polygon points="282.45 436.4 267.2 386.14 282.45 398.9 282.45 436.4" fill="#fdfdfd"/>
          <polygon points="226.82 354.64 172.63 379.57 260.05 379.57 226.82 354.64" fill="#fdfdfd"/>
          <polygon points="177.69 386.14 245.96 463.07 226.82 420.55 241.99 428.28 204.42 386.14 177.69 386.14" fill="#fdfdfd"/>
          <polygon points="256.08 436.4 256.08 386.14 216.34 386.14 233.32 408.18 236.21 393.49 256.08 436.4" fill="#fdfdfd"/>
          <polygon points="172.63 322.36 129.28 398.9 146.62 344.75 129.28 350.97 113.39 354.64 143.01 322.36 172.63 322.36" fill="#fdfdfd"/>
          <path d="M139.46,391.07c-6.52,11.12-13.05,22.23-19.57,33.35,15.32-1.41,30.65-2.83,45.97-4.24-8.8-9.7-17.6-19.4-26.4-29.11Z" fill="#fdfdfd"/>
          <polygon points="172.63 424.61 250.66 505.78 150.6 424.61 172.63 424.61" fill="#fdfdfd"/>
          <polygon points="212.37 492.94 274.83 545.16 256.08 513.48 320.02 578.55 226.82 529.75 240.26 529.75 212.37 492.94" fill="#fdfdfd"/>
          <path d="M287.43,205.53l-90.98-36.95,2.59-2.15,7.09,38.83-.91,.2-9.88-38.22-.97-3.74,3.56,1.59c-.1,.33,90.54,39.78,89.49,40.43h0Z" fill="#fdfdfd"/>
          <polygon points="150.6 431.95 167.21 447.54 133.44 454.57 150.33 443.26 136.21 443.26 150.6 431.95" fill="#fdfdfd"/>
          <polygon points="172.63 454.57 204.42 481.69 184.91 475.01 220.84 517.97 181.3 489.11 192.14 505.78 143.01 463.07 167.21 475.75 172.63 454.57" fill="#fdfdfd"/>
          <path d="M477.51,241.95h-13.11l-4.17,7.01v-7.01h-70.14l-18.78-17.78-59.96-14.69h-23.84l-83.08-34.79,2.21,10.13,10.65,7.65h-8.98l8.98,41.11v46.08h0l35.11,46.74v1.39h1.04l13.26,17.65,4.16-23.06v28.61h0s29.04,38.66,29.04,38.66l17.23-25.44-.65-.85h.65l124.26-35.57,5.92-14.06-41.35-2.29,42.6-.67,28.96-68.79Zm-113.79-11.83l12.49,11.83h-26.36l-8.88-11.83h22.76Zm-111.33,49.52v.16l-.12-.16h.12Zm-31.56-70.17v12.41l-8.47-20.78,29.98,10.39-21.51-2.01Zm49.87,84.27h-24.74l49.49-12.49-24.74,12.49Zm40.75,42.87l-14.63,29.52,8.85-34.15,79.43-17.55-73.65,22.17Zm-16.01-63.03l-35.4,7.67,35.4-15.35,119.6,1.93-119.6,5.74Z" fill="#fdfdfd"/>
        </g>
            </motion.g>

            <g id="roll">
            <g>
          <rect x="534.17" y="6.98" width="50.5" height="32.12" fill="#848383"/>
          <rect x="534.17" y="11.97" width="50.83" height="27.12" fill="#676766" opacity=".4"/>
          <path d="M579.89,45.98c-1.32,.42-2.72,.64-4.17,.64-8.39,0-15.19-7.5-15.19-16.74v-13.14C560.53,7.5,567.32,0,575.72,0,577.16,0,578.56,.22,579.89,.64c-6.37,1.99-11.02,8.45-11.02,16.1v13.14c0,7.65,4.65,14.1,11.02,16.1Z" fill="#717070"/>
          <path d="M590.9,16.74v13.14c0,7.65-4.65,14.1-11.02,16.1-6.37-1.99-11.02-8.45-11.02-16.1v-13.14c0-7.65,4.65-14.1,11.02-16.1,2.52,.79,4.77,2.27,6.57,4.26,2.75,3.03,4.45,7.22,4.45,11.84Z" fill="#848383"/>
          <ellipse cx="581.57" cy="22.87" rx="6.85" ry="15.02" fill="#969696"/>
        </g>
        <g>
          <rect x="6.23" y="6.98" width="50.5" height="32.12" transform="translate(62.96 46.07) rotate(-180)" fill="#848383"/>
          <rect x="5.91" y="11.97" width="50.83" height="27.12" transform="translate(62.64 51.07) rotate(-180)" fill="#676766" opacity=".4"/>
          <path d="M11.02,45.98c1.32,.42,2.72,.64,4.17,.64,8.39,0,15.19-7.5,15.19-16.74v-13.14C30.37,7.5,23.58,0,15.19,0c-1.45,0-2.85,.22-4.17,.64,6.37,1.99,11.02,8.45,11.02,16.1v13.14c0,7.65-4.65,14.1-11.02,16.1Z" fill="#717070"/>
          <path d="M0,16.74v13.14c0,7.65,4.65,14.1,11.02,16.1,6.37-1.99,11.02-8.45,11.02-16.1v-13.14c0-7.65-4.65-14.1-11.02-16.1-2.52,.79-4.77,2.27-6.57,4.26C1.7,7.93,0,12.12,0,16.74Z" fill="#848383"/>
          <ellipse cx="9.33" cy="22.87" rx="6.85" ry="15.02" fill="#969696"/>
        </g>
        <path d="M290.31,41.63s-.04,0-.06-.01c-.08-.02-.16-.05-.23-.08,.09,.03,.19,.06,.29,.09Z" fill="#323232"/>
        <path d="M541.76,4.55H48.31c-6.49,0-11.75,5.26-11.75,11.75v14.03c0,6.49,5.26,11.74,11.75,11.74h493.45c1.12,0,2.21-.16,3.23-.45,4.91-1.4,8.51-5.92,8.51-11.29v-14.03c0-6.49-5.26-11.75-11.74-11.75Zm-251.51,37.07c-.08-.02-.16-.05-.23-.08,.09,.03,.19,.06,.29,.09-.02,0-.04,0-.06-.01Z" fill="#323232"/>
        <path d="M290.31,41.63s-.04,0-.06-.01c-.08-.02-.16-.05-.23-.08,.09,.03,.19,.06,.29,.09Z" fill="#323232"/>
            </g>
            <motion.g
              id="lights"
              variants={lightsAnimation}
              initial="init"
              animate="visible"
            >
        <polygon points="545.85 100.93 545.85 144.71 399.43 193.8 307.24 224.72 301.51 226.64 296.85 228.2 295.25 228.74 292.69 229.59 141.75 280.2 44.55 312.79 44.55 269.01 236.03 204.81 247.9 200.83 256.63 197.91 292.18 185.98 292.19 185.98 295.25 184.95 305.04 181.67 305.05 181.67 323.83 175.37 345.52 168.1 349.22 166.85 545.85 100.93" fill="#fff" mix-blend-mode="soft-light"/>
        <polygon points="545.85 172.21 545.85 215.98 451.83 247.51 451.82 247.51 439.89 251.52 435.74 252.9 434.53 253.3 434.51 253.3 356.94 279.32 336.28 286.26 295.25 300.01 150.69 348.49 44.55 384.07 44.55 340.29 142.27 307.52 295.25 256.23 318.79 248.33 328.51 245.07 432.46 210.23 545.85 172.21" fill="#fff" mix-blend-mode="soft-light"/>
        <polygon points="545.85 334.67 545.85 431.7 444.61 465.64 416.59 475.05 411.11 476.88 411.1 476.88 407.78 477.99 404.19 479.21 368.76 491.08 368.75 491.08 365.27 492.25 295.25 515.73 136.69 568.89 47.14 598.92 44.55 597.36 44.55 502.75 129.6 474.24 129.62 474.23 152.14 466.68 154.76 465.81 295.25 418.7 458.23 364.05 545.85 334.67" fill="#fff" mix-blend-mode="soft-light"/>
        <rect x="45.02" y="41.58" width="500.85" height="12.67" fill="#202020"/>
        <rect x="47.79" y="7.15" width="214.56" height="3.89" fill="#fff" mix-blend-mode="soft-light"/>
        <rect x="370.73" y="8.27" width="165.09" height="2.22" fill="#fff" mix-blend-mode="soft-light"/>
            </motion.g>
          </g>
        </g>
      </motion.svg>
    </div>
  );
}

export default Thornheim;