-- デプロイ可能になるまで、リージェントの showcase リンク行を外す（本番の見本表示を元の形に戻す）
delete from public.links where item_id in (select id from public.items where slug = 'sample-regent') and kind = 'showcase';
