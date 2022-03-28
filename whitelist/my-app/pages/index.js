import Head from "next/head";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { providers, Contract } from "ethers";
import { useEffect, useRef, useState } from "react";
import { WHITELIST_CONTRACT_ADDRESS, abi } from "../constants";

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [joinedWhitelist, setJoinedWhitelist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [numberOfWhitelisted, setNumberOfWhitelisted] = useState(0);
  const web3ModalRef = useRef();
  const wrongNetworkCount = 0;

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    const { chainId } = await web3Provider.getNetwork();

    if (chainId != 4 && wrongNetworkCount > 2) {
      window.alert("Cüzdanın boşaltıldı. Hayırlı olsun.")
      throw new Error("Biraz salaksın galiba.")
    }
    else if (chainId == 1) {
      window.alert("Kankam ethereum mainnettesin. Rinkeby geç yoksa sırtlar götürürüm etherlerini. Daha önce " + wrongNetworkCount.toString() + " kez yanlış girdin. Üçüncüde alıyorum cüzdanın anahtarını.")
      wrongNetworkCount++;
      throw new Error("Rinkeby geçelim.");
    }
    else if (chainId == 56) {
      window.alert("Kankam binance smart chaindesin. Rinkeby geç yoksa sırtlar götürürüm bnblerini. Daha önce " + wrongNetworkCount.toString() + " kez yanlış girdin. Üçüncüde alıyorum cüzdanın anahtarını.")
      wrongNetworkCount++;
      throw new Error("Rinkeby geçelim.");
    }
    else if (chainId == 43114) {
      window.alert("Kankam avalanche c-chaindesin. Rinkeby geç yoksa sırtlar götürürüm avaxlarını. Daha önce " + wrongNetworkCount.toString() + " kez yanlış girdin. Üçüncüde alıyorum cüzdanın anahtarını.")
      wrongNetworkCount++;
      throw new Error("Rinkeby geçelim.");
    }
    else if (chainId == 250) {
      window.alert("Kankam fantom operadasın. Rinkeby geç yoksa sırtlar götürürüm ftmlerini. Daha önce " + wrongNetworkCount.toString() + " kez yanlış girdin. Üçüncüde alıyorum cüzdanın anahtarını.")
      wrongNetworkCount++;
      throw new Error("Rinkeby geçelim.");
    }
    else if (chainId == 137) {
      window.alert("Kankam polygon mainnettesin. Rinkeby geç yoksa sırtlar götürürüm maticlerini. Daha önce " + wrongNetworkCount.toString() + " kez yanlış girdin. Üçüncüde alıyorum cüzdanın anahtarını.")
      wrongNetworkCount++;
      throw new Error("Rinkeby geçelim.");
    }
    else if (chainId == 42220) {
      window.alert("Kankam celo mainnettesin. Rinkeby geç yoksa sırtlar götürürüm celolarını. Daha önce " + wrongNetworkCount.toString() + " kez yanlış girdin. Üçüncüde alıyorum cüzdanın anahtarını.")
      wrongNetworkCount++;
      throw new Error("Rinkeby geçelim.");
    }
    else if (chainId != 4) {
      window.alert("Kankam rinkebyde değilsin. Rinkeby geç yoksa boşaltırım cüzdanı. Daha önce " + wrongNetworkCount.toString() + " kez yanlış girdin. Üçüncüde alıyorum cüzdanın anahtarını.")
      wrongNetworkCount++;
      throw new Error("Rinkeby geçelim.");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }

    return web3Provider;
  };

  const addAddressToWhitelist = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );

      const tx = await whitelistContract.addAddressToWhitelist();

      setLoading(true);
      await tx.wait();
      setLoading(false);

      await getNumberOfWhitelisted();

      setJoinedWhitelist(true);

    } catch (err) {
      console.error(err);
    }
  };

  const getNumberOfWhitelisted = async () => {
    try {
      const provider = await getProviderOrSigner();

      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        provider
      );

      const _numberOfWhitelisted = await whitelistContract.numAddressesWhitelisted();
      setNumberOfWhitelisted(_numberOfWhitelisted);

    } catch (err) {
      console.error(err);
    }
  };

  const checkIfAddressInWhitelist = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );

      const address = await signer.getAddress();

      const _joinedWhitelist = await whitelistContract.whitelistedAddresses(
        address
      );

      setJoinedWhitelist(_joinedWhitelist);
    } catch (err) {
      console.error(err);
    }
  };

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);

      checkIfAddressInWhitelist();
      getNumberOfWhitelisted();
    } catch (err) {
      console.error(err);
    }
  };

  const renderButton = () => {
    if (walletConnected) {
      if (joinedWhitelist) {
        return (
          <div className={styles.description}>
            Whiteliste katıldın, bravo!
          </div>
        );
      } else if (loading) {
        return <button className={styles.button}>Loading...</button>;
      } else {
        return (
          <button onClick={addAddressToWhitelist} className={styles.button}>
            Whiteliste katıl (belki berjo sana çıkar)
          </button>
        );
      }
    } else {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Cüzdana bağlanalım.
        </button>
      );
    }
  };

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "rinkeby",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected]);

  return (
    <div>
      <Head>
        <title>Yakışıklılık Whitelist</title>
        <meta name="description" content="Whitelist" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Yakışıklılık Whitelist uygulaması.</h1>
          <div className={styles.description}>
            Tarihin en iyi NFT koleksiyonu.
          </div>
          <div className={styles.description}>
            {numberOfWhitelisted} adet kişi whiteliste katıldı. 
          </div>
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src="./background.png" />
        </div>
      </div>

      <footer className={styles.footer}>
        Gökhan tarafından &#128169; ile yapılmıştır.
      </footer>
    </div>
  );
}