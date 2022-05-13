import styled from 'styled-components';
import { NearTransaction } from '../../types/types';

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

  return (
    <TransactionDetailsStyle>
      <TransactionKeyStyle>Sender</TransactionKeyStyle>
      <TransactionValueStyle>{transaction.sender}</TransactionValueStyle>

      <TransactionKeyStyle>Receiver</TransactionKeyStyle>
      <TransactionValueStyle>{transaction.receiver}</TransactionValueStyle>

      <TransactionKeyStyle>Deposit</TransactionKeyStyle>
      <TransactionValueStyle>{transaction.id}</TransactionValueStyle>

    </TransactionDetailsStyle>
  );
}