import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/api';
import { Helmet } from 'react-helmet-async';

export default function ProductDetail() {
  const { slug } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await api.get(`/api/products/slug/${slug}`);
        if (active) setItem(res.data);
      } catch { /* 404 => redirect */ }
    })();
    return () => { active = false; };
  }, [slug]);

  if (!item) return null;

  return (
    <>
      <Helmet>
        <title>{item.name} – Orchid Store</title>
        <meta name="description" content={item.description}/>
        <meta property="og:title" content={item.name}/>
        <meta property="og:image" content={item.imageUrl}/>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type'   : 'Product',
          name        : item.name,
          image       : item.imageUrl,
          description : item.description,
          offers: {
            '@type'         : 'Offer',
            price           : item.price,
            priceCurrency   : 'VND',
            availability    : 'https://schema.org/InStock'
          }
        })}</script>
      </Helmet>

      <div className="row my-4">
        <div className="col-md-6">
          <img className="img-fluid rounded" src={item.imageUrl} alt={item.name}/>
        </div>
        <div className="col-md-6">
          <h2>{item.name}</h2>
          <p>{item.description}</p>
          <h4 className="text-danger">{item.price.toLocaleString()} đ</h4>
        </div>
      </div>
    </>
  );
}
