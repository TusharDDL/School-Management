from rest_framework import serializers
from .models import Announcement, Notification, Message, EmailLog, SMSLog
from apps.accounts.serializers import UserSerializer
from apps.academic.serializers import ClassSerializer, SectionListSerializer as SectionSerializer


class AnnouncementSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    target_classes = ClassSerializer(many=True, read_only=True)
    target_sections = SectionSerializer(many=True, read_only=True)

    class Meta:
        model = Announcement
        fields = '__all__'
        read_only_fields = ('author', 'created_at', 'updated_at')


class NotificationSerializer(serializers.ModelSerializer):
    recipient = UserSerializer(read_only=True)

    class Meta:
        model = Notification
        fields = '__all__'
        read_only_fields = ('created_at',)


class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    recipient = UserSerializer(read_only=True)

    class Meta:
        model = Message
        fields = '__all__'
        read_only_fields = ('sender', 'created_at', 'updated_at')


class EmailLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailLog
        fields = '__all__'
        read_only_fields = ('created_at', 'sent_at')


class SMSLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = SMSLog
        fields = '__all__'
        read_only_fields = ('created_at', 'sent_at')
