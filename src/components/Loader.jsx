// import React from 'react';
// import styled from 'styled-components';

// const Loader = () => {
//   return (
//     <StyledWrapper>
//       <div className="loader">
//         <div className="inner">
//         </div>
//       </div>
//     </StyledWrapper>
//   );
// }

// const StyledWrapper = styled.div`
//   .loader {
//     animation: spin 1.5s linear alternate infinite;
//     background: #B73F41;
//     border-radius: 50%;
//     height: 120px;
//     width: 120px;
//   }

//   .loader:before {
//     background: #B73F41;
//     border-radius: 50%;
//     content: '';
//     display: block;
//     height: 0.5em;
//     width: 0.5em;
//     z-index: 2;
//   }

//   .loader:after {
//     background: #262E2A;
//     border-radius: 50%;
//     box-shadow: 0em -2.60em #262E2A,
//       2.25em -4.02em #212121,
//       2.25em -1.25em #262E2A,
//       4.60em 0em #212121,
//       2.25em 1.25em #262E2A,
//       2.25em 4.02em #212121,
//       0em 2.60em #262E2A,
//       -2.25em 4.02em #212121,
//       -2.25em 1.25em #262E2A,
//       -4.60em 0em #212121,
//       -2.25em -1.25em #262E2A,
//       -2.25em -4.02em #212121;
//     content: '';
//     display: block;
//     height: 2em;
//     width: 2em;
//   }

//   .inner {
//     animation: load 1.5s linear alternate infinite;
//     border: solid 1px #B73F41;
//     border-radius: 50%;
//     height: 1.75em;
//     width: 1.75em;
//     z-index: 1;
//   }

//   .loader, .loader:before, .loader:after, .inner {
//     bottom: 0;
//     left: 0;
//     margin: auto;
//     position: absolute;
//     right: 0;
//     top: 0;
//   }

//   @keyframes load {
//     0% {
//       box-shadow: 0em -2.60em #262E2A,
//         2.25em -1.25em #262E2A,
//         2.25em 1.25em #262E2A,
//         0em 2.60em #262E2A,
//         -2.25em 1.25em #262E2A,
//         -2.25em -1.25em #262E2A;
//     }

//     15% {
//       box-shadow: 0em -2.60em #262E2A,
//         2.25em -1.25em #262E2A,
//         2.25em 1.25em #262E2A,
//         0em 2.60em #262E2A,
//         -2.25em 1.25em #262E2A,
//         -2.25em -1.25em #B73F41;
//     }

//     30% {
//       box-shadow: 0em -2.60em #262E2A,
//         2.25em -1.25em #262E2A,
//         2.25em 1.25em #262E2A,
//         0em 2.60em #262E2A,
//         -2.25em 1.25em #B73F41,
//         -2.25em -1.25em #B73F41;
//     }

//     45% {
//       box-shadow: 0em -2.60em #262E2A,
//         2.25em -1.25em #262E2A,
//         2.25em 1.25em #262E2A,
//         0em 2.60em #B73F41,
//         -2.25em 1.25em #B73F41,
//         -2.25em -1.25em #B73F41;
//     }

//     60% {
//       box-shadow: 0em -2.60em #262E2A,
//         2.25em -1.25em #262E2A,
//         2.25em 1.25em #B73F41,
//         0em 2.60em #B73F41,
//         -2.25em 1.25em #B73F41,
//         -2.25em -1.25em #B73F41;
//     }

//     75% {
//       box-shadow: 0em -2.60em #262E2A,
//         2.25em -1.25em #B73F41,
//         2.25em 1.25em #B73F41,
//         0em 2.60em #B73F41,
//         -2.25em 1.25em #B73F41,
//         -2.25em -1.25em #B73F41;
//     }

//     90% {
//       box-shadow: 0em -2.60em #B73F41,
//         2.25em -1.25em #B73F41,
//         2.25em 1.25em #B73F41,
//         0em 2.60em #B73F41,
//         -2.25em 1.25em #B73F41,
//         -2.25em -1.25em #B73F41;
//     }

//     100% {
//       box-shadow: 0em -2.60em #B73F41,
//         2.25em -1.25em #B73F41,
//         2.25em 1.25em #B73F41,
//         0em 2.60em #B73F41,
//         -2.25em 1.25em #B73F41,
//         -2.25em -1.25em #B73F41;
//     }
//   }

//   @keyframes spin {
//     0% {
//       transform: rotate(0deg);
//     }

//     15% {
//       transform: rotate(60deg);
//     }

//     30% {
//       transform: rotate(120deg);
//     }

//     45% {
//       transform: rotate(180deg);
//     }

//     60% {
//       transform: rotate(240deg);
//     }

//     75% {
//       transform: rotate(300deg);
//     }

//     90% {
//       transform: rotate(360deg);
//     }

//     100% {
//       transform: rotate(0deg);
//     }
//   }`;

// export default Loader;

import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="content">
        <div className="pill">
          <div className="medicine">
            <i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i />
          </div>
          <div className="side" />
          <div className="side" />
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .content {
    width: 50vmin;
    height: 50vmin;
    background: #fff0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .pill {
    background: #fff0;
    width: 15vmin;
    height: 40vmin;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    transform: rotate(180deg);
    animation: spin 4s linear 0s infinite;
  }

  @keyframes spin {
    100% {
      transform: rotate(-540deg);
    }
  }

  .pill .side {
    background: #f7c340;
    position: relative;
    overflow: hidden;
    width: 11vmin;
    height: 15vmin;
    border-radius: 6vmin 6vmin 0 0;
  }

  .pill .side + .side {
    background: #d9680c;
    border-radius: 0 0 6vmin 6vmin;
    border-top: 1vmin solid #621e1a;
    animation: open 2s ease-in-out 0s infinite;
  }

  @keyframes open {
    0%,
    20%,
    80%,
    100% {
      margin-top: 0;
    }
    30%,
    70% {
      margin-top: 10vmin;
    }
  }

  .pill .side:before {
    content: "";
    position: absolute;
    width: 2vmin;
    height: 10vmin;
    bottom: 0;
    right: 1.5vmin;
    background: #fff2;
    border-radius: 1vmin 1vmin 0 0;
    animation: shine 1s ease-out -1s infinite alternate-reverse;
  }

  .pill .side + .side:before {
    bottom: inherit;
    top: 0;
    border-radius: 0 0 1vmin 1vmin;
  }

  .pill .side:after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    bottom: 0;
    left: 0;
    border-radius: 6vmin 6vmin 0 0;
    border: 1.75vmin solid #00000022;
    border-bottom-color: #fff0;
    border-bottom-width: 0vmin;
    border-top-width: 1vmin;
    animation: shadow 1s ease -1s infinite alternate-reverse;
  }

  .pill .side + .side:after {
    bottom: inherit;
    top: 0;
    border-radius: 0 0 6vmin 6vmin;
    border-top-color: #fff0;
    border-top-width: 0vmin;
    border-bottom-width: 1vmin;
  }

  @keyframes shine {
    0%,
    46% {
      right: 1.5vmin;
    }
    54%,
    100% {
      right: 7.5vmin;
    }
  }

  @keyframes shadow {
    0%,
    49.999% {
      transform: rotateY(0deg);
      left: 0;
    }
    50%,
    100% {
      transform: rotateY(180deg);
      left: -3vmin;
    }
  }

  .medicine {
    position: absolute;
    width: calc(100% - 6vmin);
    height: calc(100% - 12vmin);
    background: #fff0;
    border-radius: 5vmin;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
  }

  .medicine i {
    width: 1vmin;
    height: 1vmin;
    background: #47c;
    border-radius: 100%;
    position: absolute;
    animation: medicine-dust 1.75s ease 0s infinite alternate;
  }

  .medicine i:nth-child(2n + 2) {
    width: 1.5vmin;
    height: 1.5vmin;
    margin-top: -5vmin;
    margin-right: -5vmin;
    animation-delay: -0.2s;
  }

  .medicine i:nth-child(3n + 3) {
    width: 2vmin;
    height: 2vmin;
    margin-top: 4vmin;
    margin-right: 3vmin;
    animation-delay: -0.33s;
  }

  .medicine i:nth-child(4) {
    margin-top: -5vmin;
    margin-right: 4vmin;
    animation-delay: -0.4s;
  }

  .medicine i:nth-child(5) {
    margin-top: 5vmin;
    margin-right: -4vmin;
    animation-delay: -0.5s;
  }

  .medicine i:nth-child(6) {
    margin-top: 0vmin;
    margin-right: -3.5vmin;
    animation-delay: -0.66s;
  }

  .medicine i:nth-child(7) {
    margin-top: -1vmin;
    margin-right: 7vmin;
    animation-delay: -0.7s;
  }

  .medicine i:nth-child(8) {
    margin-top: 6vmin;
    margin-right: -1vmin;
    animation-delay: -0.8s;
  }

  .medicine i:nth-child(9) {
    margin-top: 4vmin;
    margin-right: -7vmin;
    animation-delay: -0.99s;
  }

  .medicine i:nth-child(10) {
    margin-top: -6vmin;
    margin-right: 0vmin;
    animation-delay: -1.11s;
  }

  .medicine i:nth-child(1n + 10) {
    width: 0.6vmin;
    height: 0.6vmin;
  }

  .medicine i:nth-child(11) {
    margin-top: 6vmin;
    margin-right: 6vmin;
    animation-delay: -1.125s;
  }

  .medicine i:nth-child(12) {
    margin-top: -7vmin;
    margin-right: -7vmin;
    animation-delay: -1.275s;
  }

  .medicine i:nth-child(13) {
    margin-top: -1vmin;
    margin-right: 3vmin;
    animation-delay: -1.33s;
  }

  .medicine i:nth-child(14) {
    margin-top: -3vmin;
    margin-right: -1vmin;
    animation-delay: -1.4s;
  }

  .medicine i:nth-child(15) {
    margin-top: -1vmin;
    margin-right: -7vmin;
    animation-delay: -1.55s;
  }

  @keyframes medicine-dust {
    0%,
    100% {
      transform: translate3d(0vmin, 0vmin, -0.1vmin);
    }
    25% {
      transform: translate3d(0.25vmin, 5vmin, 0vmin);
    }
    75% {
      transform: translate3d(-0.1vmin, -4vmin, 0.25vmin);
    }
  }`;

export default Loader;
