import React, { useState, useEffect, useContext} from 'react';
import axios from "axios";
import './bids.css';
import { AuthContext } from "../../components/AuthContext/AuthContext";
const server = process.env.REACT_APP_WALLET_SERVER;

export default function Bids({ nftData }) {
  const { authState } = useContext(AuthContext);
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [nftDataReload, setNftData] = useState([])
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    // Extract collections available from the provided NFT data
    const uniqueCollections = Array.from(new Set(nftData.map((nft) => nft.collection)));
    setCollections(uniqueCollections);

    // Initially set all NFTs from the provided data
    setNfts(nftData);
  }, [nftData]);

  useEffect(() => {
    // Filter NFTs based on the selected collection
    if (selectedCollection) {
      const filteredNfts = nftData.filter((nft) => nft.collection === selectedCollection);
      setNfts(filteredNfts);
    } else {
      // If no collection is selected, show all NFTs
      setNfts(nftData);
    }
  }, [selectedCollection, nftData]);

  const fetchNftData = async () => {
    try {
      const response = await axios.get(
        `${server}/nft/nftsAccount/${authState.user.wallet.walletData.address}`
      );
      const nftDataReload = response.data.nfts || [];
      setNftData(nftDataReload);
    } catch (error) {
      console.error("Error fetching NFTs Data:", error);
    } finally {
    }
  };

  const handleRefresh = () => {
    fetchNftData();
  };

  return (
    <div className="navigation-content">
      <div className="bids-container">
        <div className='select-collection-div'>
          <select
            className='select-collection'
            value={selectedCollection}
            onChange={(e) => setSelectedCollection(e.target.value)}
          >
            <option value="">Todas as NFTs</option>
            {collections.map((collection, index) => (
              <option key={index} value={collection}>
                {collection}
              </option>
            ))}
          </select>
          <span className="refresh-span" onClick={handleRefresh}>Atualizar Lista</span>
        </div>

        {!nfts.length && <p className='refresh-span'>Nenhuma NFT encontrada para a coleção selecionada.</p>}

        {nfts.map((nft, index) => (
          <div className="bids-card-row" key={index}>
            <div className="bids-card-row-left">
              <img src={nft.image_url} alt="" />
            </div>
            <div className="bids-card-row-right">
              <p className="nft-title">{nft.name}</p>
              <p className='nft-collection'>
                {nft.collection} <span>{nft.currency}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
