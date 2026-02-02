# Message Board API

## 文件说明

- `messages.php` - PHP API 处理留言和回复
- `messages.json` - JSON 文件存储所有留言数据

## 权限设置

确保 `messages.json` 文件有写权限：

```bash
chmod 666 api/messages.json
```

或者在 Windows 上，确保 IIS/PHP 进程有写入权限。

## API 端点

### 获取留言
```
GET api/messages.php?action=get&page=1&per_page=10
```

### 添加留言
```
POST api/messages.php
action=add
name=客户姓名
email=customer@example.com
subject=咨询主题
message=留言内容
service=服务名称（可选）
```

### 添加回复
```
POST api/messages.php
action=reply
message_id=msg_1234567890
message=回复内容
author=TAON Team
```

## 数据结构

```json
{
  "messages": [
    {
      "id": "msg_1234567890",
      "name": "客户姓名",
      "email": "customer@example.com",
      "subject": "咨询主题",
      "message": "留言内容",
      "service": "Graphic Design",
      "timestamp": "2024-01-15T10:30:00+00:00",
      "replies": [
        {
          "id": "reply_1234567891",
          "author": "TAON Team",
          "message": "回复内容",
          "timestamp": "2024-01-15T14:20:00+00:00"
        }
      ]
    }
  ]
}
```

## 安全特性

- XSS 防护（HTML 转义）
- 输入验证和长度限制
- 文件锁定防止并发写入
- 邮箱格式验证

## 注意事项

1. 确保 PHP 有写入 `messages.json` 的权限
2. 定期备份 `messages.json` 文件
3. 如果留言量很大，考虑迁移到数据库方案
