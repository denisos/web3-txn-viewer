import styled from 'styled-components';
import { NearTransaction, Transfer } from '../../types/types';
import { scaleDepositAsNear } from '../../utils/utils';

const TransactionDetailsStyle = styled.dl`
  color: ${props => props.theme.yellow};
  margin: 10px 0 10px 30px;
  display: grid;
  grid-template-columns: 1fr 6fr;
  row-gap: 8px;
`;

const TransactionKeyStyle = styled.dt`
  margin: 0;
  &:after {
    content: ':'
  }
`;

const TransactionValueStyle = styled.dd`
  margin: 0;
`;


interface TransactionDetailsProps {
  transaction: NearTransaction;
}

export default function TransactionDetails({ transaction }: TransactionDetailsProps): JSX.Element {
  // only Transfer actions will be passed to this component
  const action: Transfer = transaction.actions[0] as Transfer;
  let deposit = action?.data?.deposit;
  deposit = scaleDepositAsNear(deposit);

  return (
    <TransactionDetailsStyle>
      <TransactionKeyStyle>Sender</TransactionKeyStyle>
      <TransactionValueStyle>{transaction.sender}</TransactionValueStyle>

      <TransactionKeyStyle>Receiver</TransactionKeyStyle>
      <TransactionValueStyle>{transaction.receiver}</TransactionValueStyle>

      <TransactionKeyStyle>Deposit</TransactionKeyStyle>
      <TransactionValueStyle>{deposit}</TransactionValueStyle>

    </TransactionDetailsStyle>
  );
}