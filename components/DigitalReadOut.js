import styled from "styled-components";
import "@fontsource/orbitron";
import React, { useContext } from "react";
import { Context } from "./AppContext";

const DigitBox = styled.span`
  font-family: "Orbitron", sans-serif;
  box-shadow: inset 0px 0px 30px 0px black;
  width: 85px;
  height: 38px;
  text-align: center;
  color: #dd1111;
  background-color: rgba(50, 20, 20, 1);
  font-size: 30px;
  transform: translateY(6px);
`;

const Label = styled.span`
  position: absolute;
  font-family: "Orbitron", sans-serif;
  background-color: #111;
  color: #ddd;
  font-size: 12px;
  transform: translateY(${(props) => props.bump}px);
`;

const Line = styled.hr`
  position: absolute;
  width: 110px;
  border: 0;
  transform: translateY(${(props) => props.bump}px);
  height: 2px;
  color: #fff;
  background-color: #ddd;
`;

const OuterOutline = styled.div`
  height: 50px;
  margin: 2px;
  width: 90px;
  border: 2px solid #aaa;
  border-radius: 10px;
  background-color: #111;
  padding: 10px;
  display: flex;
  justify-content: center;
`;
export default function DigitalReadOut({ label, measure }) {
  const [store, setStore] = useContext(Context);

  return (
    <OuterOutline>
      <Line bump={-10} />
      <Label bump={-10}>{label}</Label>

      <DigitBox>{store.rpm}</DigitBox>
      <Line bump={44} />
      <Label bump={44}>{measure}</Label>
    </OuterOutline>
  );
}
