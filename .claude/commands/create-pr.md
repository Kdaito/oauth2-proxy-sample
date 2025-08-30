---
allowed-tools: Bash(git branch:*), Bash(git diff:*), Bash(git rev-list:*), Bash(git log:*), Bash(git rev-parse:*), Bash(gh repo view:*), Bash(gh api user:*), Bash(gh pr create:*), Bash(gh pr list:*), Bash(gh pr view:*), Bash(cat:*), Bash(test:*), FileSystem
argument-hint: [target-branch]
description: 現在の作業中ブランチのプルリクエストを作成
---

# プルリクエスト作成

## バリデーション

まず以下の必須条件をチェックし、**いずれかの条件に該当する場合は処理を即座に停止**してください：

### 1. ブランチ自己参照チェック
- 現在のブランチ: !`git branch --show-current`
- 対象ブランチ: ${1:-main}

**チェック**: 現在のブランチと対象ブランチが同じ場合は、「現在のブランチ（[ブランチ名]）が対象ブランチと同じです。異なるブランチから実行してください。」と表示して**処理を停止**してください。

### 2. コミット済み差分チェック
- コミット数: !`git rev-list --count ${1:-main}..HEAD`
- 変更ファイル数: !`git diff --name-only ${1:-main}..HEAD | wc -l`

**チェック**: コミット数が0または変更ファイル数が0の場合は、「対象ブランチ（${1:-main}）との差分がないため、PRを作成する必要がありません。」と表示して**処理を停止**してください。

### 3. 既存PRチェック
- 既存PR確認コマンド: `gh pr list --head [現在のブランチ名] --json number,title,url`

**チェック**: 既存PRがある場合は、既存PRの情報を表示して**処理を停止**してください。

---

## ⚠️ 重要
上記のバリデーションで問題が見つかった場合は、以下の「詳細情報取得」や「PR作成処理」は実行せず、処理を停止してください。

---

## 詳細情報取得（バリデーション通過後のみ）

### 現在の状況
- 対象ブランチとの差分統計: !`git diff --stat ${1:-main}..HEAD`
- 変更されたファイル: !`git diff --name-only ${1:-main}..HEAD`
- 最新のコミットメッセージ: !`git log -1 --pretty=format:"%s"`

### リポジトリ情報
- リポジトリURL: !`gh repo view --json url | jq -r '.url'`
- デフォルトブランチ: !`gh repo view --json defaultBranch | jq -r '.defaultBranch'`
- 自分のGitHubアカウント: !`gh api user | jq -r '.login'`

### PRテンプレート
- .github/pull_request_template.md: !`test -f .github/pull_request_template.md && echo "存在" || echo "なし"`

## PR作成処理（全バリデーション通過後のみ）

**前提**: 上記のすべてのバリデーションが通過した場合のみ、以下の処理を実行してください。

1. **PRタイトルの決定**
   - 最新のコミットメッセージを参考に、変更内容を簡潔に表現するタイトルを生成

2. **PR本文の作成**
   - PRテンプレートをもとに作成

3. **PRの実行**
   ```bash
   gh pr create \
     --title "生成したタイトル" \
     --body "生成した本文" \
     --base "${1:-main}" \
     --assignee "@me"
   ```

4. **結果の確認**
   - 作成したPRのURLを表示
   - 作成完了メッセージを表示