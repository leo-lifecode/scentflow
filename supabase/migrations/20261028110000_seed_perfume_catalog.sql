-- Seed a starter catalogue using product photography from the respective brands' official product pages.
-- Stock values are demo placeholders and must be reconciled with physical inventory before taking live orders.
insert into public.products (name, variant, size, price, stock, description, image_url)
select seed.name, seed.variant, seed.size, seed.price, seed.stock, seed.description, seed.image_url
from (values
  ('Dior Sauvage Eau de Toilette', 'Fresh · Citrus · Woody', 30::smallint, 1490000::numeric, 10::smallint,
   'Wewangian fresh, citrus, dan woody dengan bergamot Calabria, ambroxan, elemi, dan jejak kayu. Harga katalog awal untuk varian 30 ml.',
   'https://whitelabel.dior.com/dw/image/v2/BJSW_PRD/on/demandware.static/-/Sites-pcd-whitelabel-master/default/dwf917568b/Y0685240/Y0685240_C099600545_E01_GHC.jpg?sh=700&sw=700'),
  ('Dior Sauvage Eau de Toilette', 'Fresh · Citrus · Woody', 100::smallint, 2390000::numeric, 10::smallint,
   'Wewangian fresh, citrus, dan woody dengan bergamot Calabria, ambroxan, elemi, dan jejak kayu. Harga katalog awal untuk varian 100 ml.',
   'https://whitelabel.dior.com/dw/image/v2/BJSW_PRD/on/demandware.static/-/Sites-pcd-whitelabel-master/default/dwf917568b/Y0685240/Y0685240_C099600545_E01_GHC.jpg?sh=700&sw=700'),
  ('Versace Dylan Blue Pour Homme EDT', 'Aromatic · Aquatic', 50::smallint, 1704000::numeric, 10::smallint,
   'Karakter aromatik dengan nuansa aquatic, bergamot, grapefruit, daun fig, saffron, patchouli, musk, tonka bean, dan incense.',
   'https://www.versace.com/dw/image/v2/BGWN_PRD/on/demandware.static/-/Sites-ver-master-catalog/default/dw54bd764c/original/90_R721010-R100MLS_RNUL_20_DylanBluePourHommeEDT100ml--Versace-online-store_3_1.jpg?q=85&strip=true&sw=850'),
  ('Versace Dylan Blue Pour Homme EDT', 'Aromatic · Aquatic', 100::smallint, 2163000::numeric, 10::smallint,
   'Karakter aromatik dengan nuansa aquatic, bergamot, grapefruit, daun fig, saffron, patchouli, musk, tonka bean, dan incense.',
   'https://www.versace.com/dw/image/v2/BGWN_PRD/on/demandware.static/-/Sites-ver-master-catalog/default/dw54bd764c/original/90_R721010-R100MLS_RNUL_20_DylanBluePourHommeEDT100ml--Versace-online-store_3_1.jpg?q=85&strip=true&sw=850'),
  ('Yves Saint Laurent Y Eau de Parfum', 'Fresh · Woody', 40::smallint, 1890000::numeric, 10::smallint,
   'Profil fresh dan woody dengan sage segar, geranium, sensual woods, dan tonka bean. Varian ukuran 40 ml.',
   'https://www.yslbeauty.com/dw/image/v2/BDCR_PRD/on/demandware.static/-/Sites-ysl-master-catalog/default/dw60bdd3e0/images/PACKSHOTS/FRAGRANCE/FOR_HIM/WW-50194YSL_y-edp-refill/WW-50194YSL_y-eau-de-parfum_alt3.webp?q=85&sfrm=jpg&sh=320&sm=cut&sw=320'),
  ('Yves Saint Laurent Y Eau de Parfum', 'Fresh · Woody', 100::smallint, 2850000::numeric, 10::smallint,
   'Profil fresh dan woody dengan sage segar, geranium, sensual woods, dan tonka bean. Varian ukuran 100 ml.',
   'https://www.yslbeauty.com/dw/image/v2/BDCR_PRD/on/demandware.static/-/Sites-ysl-master-catalog/default/dw60bdd3e0/images/PACKSHOTS/FRAGRANCE/FOR_HIM/WW-50194YSL_y-edp-refill/WW-50194YSL_y-eau-de-parfum_alt3.webp?q=85&sfrm=jpg&sh=320&sm=cut&sw=320'),
  ('Lattafa Asad Eau de Parfum', 'Amber · Spicy · Woody', 100::smallint, 399000::numeric, 10::smallint,
   'Aroma amber yang hangat dengan black pepper, pineapple, tobacco, patchouli, coffee, iris, vanilla, amber, dan dry woods.',
   'https://www.lattafa-usa.com/cdn/shop/files/Asad-1_ceed76c7-7a80-46b3-b372-68cc309137f4.png?v=1747421311&width=1946'),
  ('Lattafa Yara Eau de Parfum', 'Fruity · Floral · Vanilla', 100::smallint, 399000::numeric, 10::smallint,
   'Aroma fruity-floral yang lembut dengan tangerine, heliotrope, orchid, tropical notes, vanilla, sandalwood, dan musk.',
   'https://www.lattafaindia.com/cdn/shop/files/01_9a7aee64-cf5a-4cb7-adfb-ff4a40e44d2c.png?v=1768818740&width=913')
) as seed(name, variant, size, price, stock, description, image_url)
where not exists (
  select 1 from public.products existing
  where lower(existing.name) = lower(seed.name)
    and existing.size = seed.size
);
