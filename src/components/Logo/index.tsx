import { Box, styled, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';

const LogoWrapper = styled(Link)(
  () => `
        color: #5569ff;
        padding: 0 9 0 0;
        display: flex;
        text-decoration: none;
        font-weight: 700;
`
);

const LogoSignWrapper = styled(Box)(
  () => `
        width: 52px;
        height: 38px;
        margin-top: 4px;
        transform: scale(.8);
`
);

const LogoSign = styled(Box)(
  () => `
        background: #00D8FF;
        width: 18px;
        height: 18px;
        border-radius: 10px;
        position: relative;
        transform: rotate(45deg);
        top: 3px;
        left: 17px;

        &:after, 
        &:before {
            content: "";
            display: block;
            width: 18px;
            height: 18px;
            position: absolute;
            top: -1px;
            right: -20px;
            transform: rotate(0deg);
            border-radius: 6px;
        }

        &:before {
            background: #5569ff
            right: auto;
            left: 0;
            top: 20px;
        }

        &:after {
            background: #6E759F;
        }
`
);

const LogoSignInner = styled(Box)(
  () => `
        width: 16px;
        height: 16px;
        position: absolute;
        top: 12px;
        left: 12px;
        z-index: 5;
        border-radius: 6px;
        background: #ffffff;
`
);

const LogoTextWrapper = styled(Box)(
  () => `
        padding-left: 9px;
`
);

const VersionBadge = styled(Box)(
  () => `
        background: #57CA22;
        color: #ffffff;
        padding: 3.6px 9px;
        border-radius: 6px;
        text-align: center;
        display: inline-block;
        line-height: 1;
        font-size: 0.688rem;
`
);

const LogoText = styled(Box)(
  () => `
        font-size: 0.938rem;
        font-weight: 700;
`
);

function Logo() {
  return (
    <LogoWrapper to="/admin">
      <img src={"http://10.0.12.48:5000/assets/img/logo.png"} className="imageDimension-class" alt="Guardian Trading-Logo" title='-Logo' style={{ width: " %" }} />
      {/* <LogoSignWrapper>
        <LogoSign>
          <LogoSignInner />
        </LogoSign>
      </LogoSignWrapper>
      <Box
        component="span"
        sx={{
          display: { xs: 'none', sm: 'inline-block' }
        }}
      >
        <LogoTextWrapper>
          <Tooltip title="Version 2.0" arrow placement="right">
            <VersionBadge>1.0.0</VersionBadge>
          </Tooltip>
          <LogoText>Guardian Trading</LogoText>
        </LogoTextWrapper>
      </Box> */}
    </LogoWrapper>
  );
}

export default Logo;
