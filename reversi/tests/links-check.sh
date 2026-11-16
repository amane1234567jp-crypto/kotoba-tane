#!/bin/bash
# 招待リンク（www.uchinoaji.com/rv）と ユニバーサルリンク・App Links の設定が 公開されているか
for u in https://www.uchinoaji.com/.well-known/apple-app-site-association https://www.uchinoaji.com/.well-known/assetlinks.json https://app-site-association.cdn-apple.com/a/v1/www.uchinoaji.com; do
  echo "== $u"; curl -s -m 20 -D - "$u" | sed -n '1p;/^content-type/Ip;$p' | head -5; echo
done
echo "== /rv/?r=test"; curl -s -m 20 "https://www.uchinoaji.com/rv/?r=test&n=x" | grep -o '<base[^>]*>\|<title>[^<]*</title>\|アプリで ひらく' | head -5
