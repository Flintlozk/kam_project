
from django.db import models

class Audience(models.Model):
    customer_id = models.BigIntegerField(blank=True, null=True)
    page_id = models.IntegerField(blank=True, null=True)
    domain = models.TextField(blank=True, null=True)  # This field type is a guess.
    status = models.TextField(blank=True, null=True)  # This field type is a guess.
    created_at = models.DateTimeField(blank=True, null=True)
    score = models.SmallIntegerField()

    class Meta:
        managed = False
        db_table = 'audience'

class Messages(models.Model):
    object = models.TextField()
    pageID = models.IntegerField()  # Field name made lowercase. This field type is a guess.
    audienceID = models.IntegerField()  # Field name made lowercase. This field type is a guess.
    createdAt = models.DateTimeField()  # Field name made lowercase.
    mid = models.TextField()
    text = models.TextField()
    attachments = models.TextField()
    sentBy = models.TextField()  # Field name made lowercase.
    payload = models.TextField()

    class Meta:
        managed = False
        db_table = 'messages'

class Comments(models.Model):
    replies = models.TextField()
    text = models.TextField()
    pageID = models.IntegerField()  # Field name made lowercase. This field type is a guess.
    audienceID = models.IntegerField()  # Field name made lowercase. This field type is a guess.
    postID = models.TextField()
    commentID = models.TextField()
    payload = models.TextField()
    attachments = models.TextField()
    sentBy = models.TextField()  # Field name made lowercase.
    isReply = models.BooleanField()
    hidden = models.BooleanField()
    createdAt = models.TextField()  # Field name made lowercase.
    allowReply = models.BooleanField()

    class Meta:
        managed = False
        db_table = 'comments'