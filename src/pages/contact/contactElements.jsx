import styled from "styled-components";

export const BodyContainer = styled.div`
  position: relative;
  overflow: hidden;
  padding-bottom: 40px;
  background-color: hsl(347, 62%, 95%);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 56 28' width='56' height='28'%3E%3Cpath fill='%239C92AC' fill-opacity='0.3' d='M56 26v2h-7.75c2.3-1.27 4.94-2 7.75-2zm-26 2a2 2 0 1 0-4 0h-4.09A25.98 25.98 0 0 0 0 16v-2c.67 0 1.34.02 2 .07V14a2 2 0 0 0-2-2v-2a4 4 0 0 1 3.98 3.6 28.09 28.09 0 0 1 2.8-3.86A8 8 0 0 0 0 6V4a9.99 9.99 0 0 1 8.17 4.23c.94-.95 1.96-1.83 3.03-2.63A13.98 13.98 0 0 0 0 0h7.75c2 1.1 3.73 2.63 5.1 4.45 1.12-.72 2.3-1.37 3.53-1.93A20.1 20.1 0 0 0 14.28 0h2.7c.45.56.88 1.14 1.29 1.74 1.3-.48 2.63-.87 4-1.15-.11-.2-.23-.4-.36-.59H26v.07a28.4 28.4 0 0 1 4 0V0h4.09l-.37.59c1.38.28 2.72.67 4.01 1.15.4-.6.84-1.18 1.3-1.74h2.69a20.1 20.1 0 0 0-2.1 2.52c1.23.56 2.41 1.2 3.54 1.93A16.08 16.08 0 0 1 48.25 0H56c-4.58 0-8.65 2.2-11.2 5.6 1.07.8 2.09 1.68 3.03 2.63A9.99 9.99 0 0 1 56 4v2a8 8 0 0 0-6.77 3.74c1.03 1.2 1.97 2.5 2.79 3.86A4 4 0 0 1 56 10v2a2 2 0 0 0-2 2.07 28.4 28.4 0 0 1 2-.07v2c-9.2 0-17.3 4.78-21.91 12H30zM7.75 28H0v-2c2.81 0 5.46.73 7.75 2zM56 20v2c-5.6 0-10.65 2.3-14.28 6h-2.7c4.04-4.89 10.15-8 16.98-8zm-39.03 8h-2.69C10.65 24.3 5.6 22 0 22v-2c6.83 0 12.94 3.11 16.97 8zm15.01-.4a28.09 28.09 0 0 1 2.8-3.86 8 8 0 0 0-13.55 0c1.03 1.2 1.97 2.5 2.79 3.86a4 4 0 0 1 7.96 0zm14.29-11.86c1.3-.48 2.63-.87 4-1.15a25.99 25.99 0 0 0-44.55 0c1.38.28 2.72.67 4.01 1.15a21.98 21.98 0 0 1 36.54 0zm-5.43 2.71c1.13-.72 2.3-1.37 3.54-1.93a19.98 19.98 0 0 0-32.76 0c1.23.56 2.41 1.2 3.54 1.93a15.98 15.98 0 0 1 25.68 0zm-4.67 3.78c.94-.95 1.96-1.83 3.03-2.63a13.98 13.98 0 0 0-22.4 0c1.07.8 2.09 1.68 3.03 2.63a9.99 9.99 0 0 1 16.34 0z'%3E%3C/path%3E%3C/svg%3E");
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;

  @media (min-width: 320px) and (max-width: 575px) {
    padding-bottom: 20px;
  }
`;

export const ContentOverlayContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  .titleBox {
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
  }
  @media (min-width: 320px) and (max-width: 575px) {
    margin-top: 100px;
  }
  @media (min-width: 576px) and (max-width: 767px) {
    margin-top: 100px;
  }
  @media (min-width: 768px) {
    margin-top: 100px;
  }
`;

export const TitleMsgTextContainer = styled.div`
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
  background-color: hsl(347, 62%, 92%);
  color: hsl(248, 50%, 70%);
  border-radius: 1%;
  box-shadow: 0 4px 6px 0 hsla(0, 0%, 0%, 0.1);
  width: 400px;
  height: 100px;
  h1 {
    text-align: center;
  }
  @media (min-width: 320px) and (max-width: 575px) {
    h1 {
      margin: 10px auto 10px auto;
      padding: 20px 25px 0px 25px;
      font-size: 0.75rem;
    }
  }
  @media (min-width: 576px) and (max-width: 767px) {
    h1 {
      margin: 20px auto 20px auto;
      padding: 30px 35px 0px 30px;
      font-size: 1rem;
    }
  }

  @media (min-width: 768px) {
    h1 {
      margin: 20px auto 20px auto;
      padding: 40px 50px 0px 50px;
      font-size: 1.5rem;
    }
  }
`;

//Rename container TODO in contact.js
export const FormContainer = styled.div`
  max-width: 800px;
  display: block;
  span {
    font-size: 1.5rem;
  }

  @media (min-width: 320px) and (max-width: 575px) {
    padding: 10px;
    span {
      font-size: 0.75rem;
    }
  }
  @media (min-width: 576px) and (max-width: 767px) {
    padding: 20px;
    span {
      font-size: 1rem;
    }
  }
  @media (min-width: 768px) {
    padding: 30px;
    span {
      font-size: 1.25rem;
    }
  }
`;

export const Form = styled.div`
  margin-top: 0px !important;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(3, 1fr);
  grid-row-gap: 50px;
  border-radius: 40px;
  padding: 40px;
  background-color: hsl(347, 62%, 95%);
  height: 600px !important;
`;

export const FormTextInput = styled.div`
  input {
    grid-area: 1 / 1 / 2 / 2;
    width: 90%;
    height: 50px;
    margin-bottom: 45px;
    border: 0;
    margin-top: 7px;
    padding-left: 10px;
    background: #ffffff;
    -webkit-box-shadow: 0px 0px 48px 0px rgb(218, 218, 218);
    box-shadow: 0px 2px 4px 0px rgb(218, 218, 218);
  }
  @media (min-width: 320px) and (max-width: 575px) {
    input {
      width: 100%;
    }
  }
  @media (min-width: 576px) and (max-width: 767px) {
    input {
      width: 100%;
    }
  }
  @media (min-width: 768px) {
    input {
      width: 50%;
    }
  }
`;

export const FormTextAreaInput = styled.div`
  textarea {
    grid-area: 1 / 2 / 2 / 3;
    width: 90%;
    border: 0;
    margin-top: 5px;
    height: 300px;
    color: black;
    -webkit-box-shadow: 0px 0px 8px 0px rgb(218, 218, 218);
    box-shadow: 0px 2px 4px 0px rgb(218, 218, 218);
    padding-top: 3%;
    padding-left: 3%;
  }
`;

export const FormBtn = styled.button`

    grid-area: 2 / 1 / 3 / 3;
    width: 200%;
    height: 50px;
    margin-top: -50px !important;
    vertical-align: middle;
    margin-left: auto !important;
    margin-right: auto !important;
    border: 0;
    border-radius: 15px;
    background-color: #7ce095;
    -webkit-transition: 0.3s linear;
    -o-transition: 0.3s linear;
    transition: 0.3s linear;
    color: black;
    font-weight: bold;
    font-size: 16px;
  

:hover {
    background-color: snow;
    border: 2px solid #fca17d;
    -webkit-transition: 0.3s linear;
    -o-transition: 0.3s linear;
    transition: 0.3s linear;
    color: black;
    cursor: pointer;
    transform: translateY(-10px);
    transition: 0.3s ease-in-out;
  }

  @media (min-width: 320px) and (max-width: 575px) {
    button {
      width: 100%;
      font-size: 1.25rem;
      padding: 15px;
    }
    @media (min-width: 576px) and (max-width: 767px) {
      button {
        width: 100%;
        font-size: 1rem;
        padding: 10px;
      }
    }
    @media (min-width: 768px) {
      button {
        width: 25%;
        font-size: 1.5rem;
        padding: 20px;
      }
    }
  }
`;

export const SubmittedForm = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

export const LottieBg = styled.div`
  position: absolute;
  width: 100%;
  bottom: 200;

  .active {
    display: block;
  }
`;

export const SentMsg = styled.div`
  p {display: flex;
  justify-content: center;
  text-align: center;
  color: #2a292c;
  margin-top: -100px !important;
  z-index: 4;
  word-wrap: break-word;
  width: 80%;
  }
`;

/* * {
  background: #000 !important;
  color: #0f0 !important;
  outline: solid #f00 1px !important;
} */
