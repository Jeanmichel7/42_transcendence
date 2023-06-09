import styled from 'styled-components';
import laser from '../../assets/laser.png';
import slow from '../../assets/slow.png';
import bigRacket from '../../assets/bigRacket.png';


const BonusBoxWrapper = styled.div`
width: 75px;
height: 75px;
border : 1px solid white;
position: absolute;
left: 25px;
top: 25px;
`

function BonusBox({ bonusName,bonusIsLoading}: any) {
  return (
    <BonusBoxWrapper>
    </BonusBoxWrapper>
  );
}
export default BonusBox;
