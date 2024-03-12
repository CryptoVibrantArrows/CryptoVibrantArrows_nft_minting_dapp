import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: var(--primary);
  padding: 12px;
  font-size: 24px;
  font-weight: bold;
  color: var(--secondary-text);
  width: flex;
  cursor: pointer;
 
 
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: var(--primary);
  padding: 10px;
  font-weight: bold;
  font-size: 20px;
  color: var(--accent-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 80%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  width: 1400px;
  @media (min-width: 720px) {
    width: 1000px;
  }
  transition: width 0.5s;
  transition: height 0.5s;

`;

export const StyledSmallLogo = styled.img`
  width: 20px;
  @media (min-width: 20px) {
    width: 18px;
  }
  transition: width 0.5s;
  transition: height 0.5s;

`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 120px;
  }
  @media (min-width: 1000px) {
    width: 120px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: var(--accenttree);
  text-decoration: none;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [checkfreemint, setcheckfreemint] = useState(true);
  const [feedback, setFeedback] = useState(`Click mint to start minting your NFT.`);
  const [mintAmount, setMintAmount] = useState(1);
  const fmljson = require('./wallet.json');
  const freemintlist = fmljson.address;

  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });


  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mintarrows(mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong. Please try again. ");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `Amazing, ${CONFIG.NFT_NAME} was successfully minted. Visit Opensea.io to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 3) {
      newMintAmount = 3;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
      checkMintData();
    }
  };


  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  const checkMintData = ()=>{
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      let add = String(blockchain.account);  
          if(freemintlist.includes(add)){
            setcheckfreemint(true);
          }else{
            setcheckfreemint(false);
          }
        
    }

  };


  return (
    <s.Screen>
      <s.Container
        flex={1}
        ai={"center"}
        style={{ padding: 10, backgroundColor: "var(--primary)" }}
        image={CONFIG.SHOW_BACKGROUND ? "/config/images/voidverse3s2.gif" : null}
      > 
        <StyledLogo alt={"CryptoVibrantArrows"} src={"/config/images/bglogo2.png"} />
    
        <ResponsiveWrapper flex={1} style={{ padding: 10 }} test>
          <s.Container flex={1} jc={"centre"} ai={"center"}>
          </s.Container>
          <s.SpacerMedium />
          <s.Container
            flex={1}
            jc={"center"}
            ai={"center"}
            style={{
              backgroundColor: "var(--accentbox)",
              padding: 15,
              borderRadius: 24,
              boxShadow: "0px 5px 5px 2px rgba(0,0,0,0.7)",
              opacity:0.95
            }}
          >
             <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 14,
                color: "var(--accentadd)",
                fontWeight: "bold",
              }}
            >
            {blockchain.account}
            </s.TextTitle>
            <s.SpacerSmall />
            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 24,
                color: "var(--accentmint)",
                fontWeight: "bold",
              }}
            >
            Free Mint Live!
            </s.TextTitle>
            <s.SpacerMedium />
             <StyledImg alt={"CVA"} src={"/config/images/opensea.png"} />
            <s.TextDescription
              style={{
                textAlign: "center",
                color: "var(--accenttree)",
                textDecorationLine: 'underline'
              }}
            >
              <s.SpacerMedium />
              <StyledLink target={"_blank"} href={"https://linktr.ee/CryptoVibrantArrows"}>
                {truncate("CVA- LinkTree", 17)}
              </StyledLink>
            </s.TextDescription>

            {blockchain.account === "" ||
                blockchain.smartContract === null ?( <s.TextTitle
                  style={{
                    textAlign: "center",
                    fontSize: 22,
                    color: "var(--accentmint)",
                    fontWeight: "bold",
                  }}
                >
                 Minted-  ? / {CONFIG.MAX_SUPPLY}
                </s.TextTitle>):( <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 24,
                color: "var(--accentmint)",
                fontWeight: "bold",
              }}
            >
             Minted - {data.totalSupply} / {CONFIG.MAX_SUPPLY}
             
            </s.TextTitle>)}
            {blockchain.account === "" ||
                blockchain.smartContract === null ?(<s.TextTitle
                  style={{
                    textAlign: "center",
                    fontSize: 22,
                    color: "var(--accentsupply)",
                    fontWeight: "bold",
                  }}
                >
                 Total free mint supply left - ? / 301
                </s.TextTitle>):(<s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 22,
                color: "var(--accentsupply)",
              }}
            >
             Total free mint supply left - {data.freeMintLeft} / 301
            </s.TextTitle>)}
            
            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 18,
                color: "var(--accentsupply)",
              }}
            >
             Max free mint allowed per address - 3
            </s.TextTitle>       
            {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  The sale has ended.
                </s.TextTitle>
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  You can still find {CONFIG.NFT_NAME} on
                </s.TextDescription>
                <s.SpacerSmall />
                <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                  {CONFIG.MARKETPLACE}
                </StyledLink>
              </>
            ) : (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accentprice)" ,fontSize: 18}}
                >
                  Free Mint Cost is 0.0 Eth
                </s.TextTitle>
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accentprice)", fontSize: 14 }}
                >
                  *Excluding gas fees
                </s.TextDescription>
                <s.SpacerSmall />
                {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                  <s.Container ai={"center"} jc={"center"}>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      Connect to the {CONFIG.NETWORK.NAME} network
                    </s.TextDescription>
                    <s.SpacerMedium />
                    <StyledButton
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                        
                      }}
                    >
                      CONNECT
                    </StyledButton>
                    {blockchain.errorMsg !== "" ? (
                      <>
                        <s.SpacerSmall />
                        <s.TextDescription
                          style={{
                            textAlign: "center",
                            color: "var(--accent-text)",
                            fontSize: 17,
                          }}
                        >
                          {blockchain.errorMsg}
                        </s.TextDescription>
                      </>
                    ) : null}
                  </s.Container>
                ) : (
                  <>  
                    {
                    !checkfreemint?(
                      <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                        fontSize: 17,
                      }}
                    >
                      Sorry, Connected Address is not on CVA Free Mint List
                    </s.TextDescription>
                    ):(
                      <>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                        fontSize: 17,
                      }}
                    >
                      {feedback}
                    </s.TextDescription>
                
                    <s.SpacerMedium />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledRoundButton
                        style={{ lineHeight: 0.4 }}
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          decrementMintAmount();
                        }}
                      >
                        -
                      </StyledRoundButton>
                      <s.SpacerMedium />
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text)",
                          fontSize:20
                        }}
                      >
                        {mintAmount}
                      </s.TextDescription>
                      <s.SpacerMedium />
                      <StyledRoundButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          incrementMintAmount();
                        }}
                      >
                      +
                      </StyledRoundButton>
                    </s.Container>
                    <s.SpacerSmall />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          claimNFTs();
                          getData();
                        }}
                      >
                        {claimingNft ? "MINTING.." : "MINT"}
                      </StyledButton>
                    </s.Container>
                    </>
                    )}
                  </>
                )}
              </>
            )}
            <s.SpacerMedium />
          </s.Container>
          <s.SpacerLarge />
          <s.Container flex={1} jc={"center"} ai={"center"}>
            
          </s.Container>
        </ResponsiveWrapper>
        <s.SpacerMedium />
       
      </s.Container>
    </s.Screen>
  );
}

export default App;
