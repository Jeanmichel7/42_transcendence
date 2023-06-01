import styled from 'styled-components';
import DotWaitings from './Utils';

const OverlayWrapper = styled.div`
  background-color: rgba(128, 128, 128, 0.5);
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
`;

function Overlay() {
  return (
    <OverlayWrapper>
      <DotWaitings />
    </OverlayWrapper>
  );
}
