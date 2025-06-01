pragma solidity ^0.8.19;

import { ILayerZeroComposer } from "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/ILayerZeroComposer.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { OFTComposeMsgCodec } from "@layerzerolabs/lz-evm-oapp-v2/contracts/oft/libs/OFTComposeMsgCodec.sol";

interface ISwapRouter {
    function exactInputSingle(
        bytes calldata params
    ) external payable returns (uint256 amountOut);
}

contract ComposerReceiverUniswap is ILayerZeroComposer {
    address public immutable lzEndpoint;
    address public immutable stargate;
    ISwapRouter public constant router =
        ISwapRouter(0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45); // Base

    address public constant USDC =
        0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;

    event SwappedToUSDC(uint256 amountOut);

    constructor(address _endpoint, address _stargate) {
        lzEndpoint = _endpoint;
        stargate = _stargate;
    }

    /// called by LayerZero Endpoint during compose
    function lzCompose(
        address _from,
        bytes32,                 // _guid
        bytes calldata _message, // encoded by OFTComposeMsgCodec
        address,                 // _executor
        bytes calldata           // _extraData
    ) external payable override {
        require(msg.sender == lzEndpoint, "!endpoint");
        require(_from == stargate, "!stargate");

        uint256 amountLD = OFTComposeMsgCodec.amountLD(_message); // token B miktarı
        (address tokenReceiver, address oftOnDest, uint256 amountOutMin, uint24 uniFee) =
            abi.decode(OFTComposeMsgCodec.composeMsg(_message),
                      (address, address, uint256, uint24));

        // onay & swap
        IERC20(oftOnDest).approve(address(router), amountLD);
        bytes memory params = abi.encodeWithSignature(
            "exactInputSingle((address,address,uint24,address,uint256,uint256,uint256,uint160))",
            oftOnDest,
            USDC,
            uniFee,
            tokenReceiver,
            block.timestamp + 300,
            amountLD,
            amountOutMin,
            0
        );
        uint256 out = router.exactInputSingle(params);
        emit SwappedToUSDC(out);
    }

    receive() external payable {}
}
