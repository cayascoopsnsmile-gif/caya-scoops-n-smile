# Caya Scoops N Smile Firebase Functions

This folder contains backend automations for the Caya Scoops N Smile app.

## Birthday Reward Email

`sendDailyBirthdayRewards` runs every day at 9:00 AM Trinidad time.

It reads customer records from the `users` collection, checks `dateOfBirth` or `dob`,
and sends the EmailJS template `birthday_reward` once per customer per year.

After a successful email, it writes these fields to both `users/{customerId}` and
`customers/{customerId}`:

- `name`
- `email`
- `dob`
- `birthdaySent`
- `birthdaySentYear`
- `birthdayRewardYear`
- `birthdayRewardDate`
- `birthdayRewardExpiry`
- `birthdayRewardStatus`
- `birthdayRewardName`
- `birthdayRewardValidDays`

## EmailJS Template Variables

Create an EmailJS template with ID `birthday_reward` and use:

- `{{customer_name}}`
- `{{to_email}}`
- `{{from_name}}`
- `{{reply_to}}`
- `{{reward_name}}`
- `{{reward_valid_days}}`
- `{{expiry_date}}`
- `{{business_phone}}`
- `{{business_email}}`
- `{{message}}`

## Daily Operations Automations

The functions folder also includes:

- `sendDailyLowStockAlert`: runs daily at 8:30 AM Trinidad time and emails low-stock items using EmailJS template `low_stock_alert`.
- `createDailyBackupSnapshot`: runs daily at 2:00 AM Trinidad time and saves collection-count backup snapshots in `backupLogs`.
- `sendOwnerDailySummary`: runs daily at 9:00 PM Trinidad time and emails the owner daily sales summary using EmailJS template `owner_daily_summary`.

Extra EmailJS template variables:

Low stock:

- `{{to_email}}`
- `{{business_name}}`
- `{{threshold}}`
- `{{item_count}}`
- `{{low_stock_items}}`
- `{{reply_to}}`

Owner summary:

- `{{to_email}}`
- `{{business_name}}`
- `{{report_date}}`
- `{{total_sales}}`
- `{{cash_sales}}`
- `{{online_sales}}`
- `{{refunds}}`
- `{{order_count}}`
- `{{points_issued}}`
- `{{best_product}}`
- `{{pending_voids}}`
- `{{low_stock_items}}`
- `{{summary}}`
- `{{reply_to}}`

## Deploy

From the project folder:

```powershell
cd "C:\Users\cindy\OneDrive\Documents\New project"
firebase deploy --only functions
```

If Firebase asks you to enable billing or APIs, follow the Firebase prompts.
