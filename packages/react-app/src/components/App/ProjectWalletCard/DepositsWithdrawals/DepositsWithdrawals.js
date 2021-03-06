import React, { useState } from "react";
import { useBalance, useCustomContractReader } from "../../../../hooks";
import { parseEther, formatEther } from "@ethersproject/units";
import mobiscroll from "@mobiscroll/react";
import "@mobiscroll/react/dist/css/mobiscroll.min.css";

const DepositsWithdrawals = ({ contract, localProvider, projectWalletService }) => {
  const [sendValue, setSendValue] = useState("");
  const [withdrawValue, setWithdrawValue] = useState("");
  const projectWalletBalance = useBalance(localProvider, contract && contract.address);
  const allocatedEth = useCustomContractReader(contract, "checkBalance");
  return (
    <mobiscroll.Form theme="mobiscroll" themeVariant="light">
      <div style={{ display: "flex", flexWrap: "wrap", flexDirection: "row" }}>
        <div style={{ flexGrow: "1" }}>
          <mobiscroll.FormGroup style={{}}>
            <mobiscroll.FormGroupTitle>Current Balance</mobiscroll.FormGroupTitle>
            <mobiscroll.Input
              placeholder="First Name"
              name="total-balance"
              value={projectWalletBalance && `${formatEther(projectWalletBalance)} ETH`}
            >
              Project Wallet Balance
            </mobiscroll.Input>
            <mobiscroll.Input
              placeholder="Last Name"
              name="your-balance"
              value={allocatedEth && `${formatEther(allocatedEth)} ETH`}
            >
              Your Allocation
            </mobiscroll.Input>
          </mobiscroll.FormGroup>
        </div>
        <div style={{ flexGrow: "1" }}>
          <mobiscroll.FormGroup>
            <mobiscroll.FormGroupTitle>Deposits</mobiscroll.FormGroupTitle>
            <mobiscroll.Input
              name="deposit"
              class="text-input"
              onChange={e => setSendValue(e.target.value)}
              placeholder="Enter amount to deposit"
              value={sendValue}
            >
              Amount to deposit:
            </mobiscroll.Input>
            <mobiscroll.Button
              onClick={() => {
                projectWalletService.deposit(sendValue);
              }}
            >
              💵 Deposit ETH
            </mobiscroll.Button>
          </mobiscroll.FormGroup>
        </div>
        <div style={{ flexGrow: "1" }}>
          <mobiscroll.FormGroup>
            <mobiscroll.FormGroupTitle>Withdrawals</mobiscroll.FormGroupTitle>
            <mobiscroll.Input
              value={withdrawValue}
              placeholder="Enter amount to withdraw"
              onChange={e => {
                setWithdrawValue(e.target.value);
              }}
            >
              Amount to withdraw:
            </mobiscroll.Input>
            <mobiscroll.Button
              onClick={() => {
                projectWalletService.withdraw(parseEther(withdrawValue));
              }}
            >
              💵 Withdraw ETH
            </mobiscroll.Button>
            <mobiscroll.Button
              onClick={() => {
                projectWalletService.withdrawMax();
              }}
            >
              💵 Withdraw all ({allocatedEth && formatEther(allocatedEth)}) ETH
            </mobiscroll.Button>
          </mobiscroll.FormGroup>
        </div>
      </div>
    </mobiscroll.Form>
  );
};

export default DepositsWithdrawals;
