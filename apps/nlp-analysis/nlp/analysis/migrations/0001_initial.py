# Generated by Django 3.0.5 on 2020-09-08 04:35

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Audience',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('customer_id', models.BigIntegerField(blank=True, null=True)),
                ('page_id', models.IntegerField(blank=True, null=True)),
                ('domain', models.TextField(blank=True, null=True)),
                ('status', models.TextField(blank=True, null=True)),
                ('created_at', models.DateTimeField(blank=True, null=True)),
                ('score', models.SmallIntegerField()),
            ],
            options={
                'db_table': 'audience',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Messages',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('object', models.TextField()),
                ('pageID', models.IntegerField()),
                ('audienceID', models.IntegerField()),
                ('createdAt', models.DateTimeField()),
                ('mid', models.TextField()),
                ('text', models.TextField()),
                ('attachments', models.TextField()),
                ('sentBy', models.TextField()),
                ('payload', models.TextField()),
            ],
            options={
                'db_table': 'messages',
                'managed': False,
            },
        ),
    ]