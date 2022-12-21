# CHiLO Portal 用語

## データ構造

### 育成指標の構造
- 教育委員会 / Consumer
  - 教員育成指標 / Framework
    - 成長段階 / Stage
    - 指標項目 / Field
      - 指標目標は大中小のグループ分けした階層構造を持つ / Field1， Field2， Field3
      - 指標項目の成長段階毎の目標 / Goal

### バッジの構造
- 能力バッジ / Wisdom Badge
  - 知識バッジ / Knowledge Badge
    - クライテリア (知識バッジ取得要件) / Criteria

クライテリアとしては次の種類があり、その種別毎のアイコンも用意する。
- ビデオ
- 小テスト： テストアイコン
- レッスン： レッスンアイコン
- アンケート： アンケートアイコン

### バッジとコース
能力バッジは LMS 上でのコースと 1:1 対応しており、コースの履修結果として能力バッジが付与される形となっている。
なお、コースの中で複数の知識バッジ習得があるが、コースに含まれる教材全てが知識バッジを取得できるものとは限らない。

## 用語

日本語での 50 音順です。

### カテゴリ / Category
ここではポータルサイトにおけるバッジを分類するカテゴリのこと。バッジマップに於いて定義する。

### 教員育成指標 / Framework
教育委員会などが学校種及び職の範囲に応じて育成指標をまとめたもの。

学校種としては小学校、中学校、高等学校及び特別支援学校については共通の場合が多く、職種としては「教諭」「養護教諭」「栄養教諭」の他に「校長」や「管理職」のような分け方をしている場合が多い。

- TEACHER TRAINING INDEX と英語では呼ばれることがある （[参考1](http://www.fuku-c.ed.jp/center/ikuseishihyou.html)，[参考2](https://kaken.nii.ac.jp/file/KAKENHI-PROJECT-17K18621/17K18621seika.pdf)，[参考3](https://www.pref.saga.lg.jp.e.zg.hp.transer.com/kiji00359787/index.html)）
- コンピテンシーの考え方からするとこれは Competency Model であるが、教員研修業界では Teacher Training Index という個別用語を使うことがある。
- コンピテンスの集まりがコンピテンシーとは限らないなど分野による定義の違いもあるため、今回はコンピテンシーという用語は当てず、[OECD のコンピテンシーフレームワーク](https://www.oecd.org/careers/competency_framework_en.pdf) を参考に英語表記としては Framework という語を充てる (Index では DB 用語と区別しにくいので)。

### コンシューマ / Consumer
教育委員会

### 指標項目 (資質と能力の領域) / Field
育成指標のうち、資質や能力の種類にあたるもの (PDF では行) を指す。

教育委員会毎の定義に依るが、範囲の広いモノから狭いものまで最大で大中小の 3 段階の領域 (Field) に分けて分類される。

この粒度を Compitency と指す案があったが、Compitency という言葉の定義の曖昧さが混乱を招きかねないので避けている。また、カテゴリという言い方はポータルカテゴリとの競合があるので避けている。

### 成長段階 (ステージ)  / Stage

育成指標のうち、教員の経験年数や職位等にあたるもの (PDF では列) を指す。

ライフステージ毎の教員育成指標とかキャリア段階といった呼ばれ方をする事もある。
成長段階毎にそれぞれのコンピテンシーをより高いレベルのものにしていくという教員育成を行う。

### 知識バッジ (知恵バッジ) / Knowledge Badge

Data / Information / Knowledge / Wisdom / Competency という構造があり、Knowledge にあたる。

### 能力バッジ / Wisdom Badge

Data / Information / Knowledge / Wisdom / Competency という構造があり、Wisdom にあたる。


### バッジクラス / BadgeClass
Open Badge で記述されたバッジの定義をするもの。バッジクラスは一度誰かにバッジを発行したらその後は不変になる点に注意。

- Open Badge 仕様: https://www.imsglobal.org/sites/default/files/Badges/OBv2p0Final/index.html#BadgeClass

## 参考

CHiBi CHiLOの用語一覧
https://npocccties.github.io/chibichilo/V2.1/Design/build/html/Glossary.html