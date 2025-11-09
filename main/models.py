from django.db import models
from django.utils.text import slugify


class TeamMember(models.Model):
    name = models.CharField(max_length=120)
    email = models.EmailField(blank=True)
    title = models.CharField(max_length=120, blank=True)
    bio = models.TextField(blank=True)
    instagram = models.URLField(blank=True)
    linkedin = models.URLField(blank=True)
    x = models.URLField(blank=True)
    # optional profile photo
    def team_photo_upload_path(instance, filename):
        base = slugify(instance.name) if instance.name else 'member'
        return f'team/{base}/{filename}'
    photo = models.ImageField(upload_to=team_photo_upload_path, blank=True, null=True)
    # gender and pronouns
    GENDER_MALE = 'male'
    GENDER_FEMALE = 'female'
    GENDER_NONBINARY = 'nonbinary'
    GENDER_OTHER = 'other'
    GENDER_CHOICES = (
        (GENDER_MALE, 'Male'),
        (GENDER_FEMALE, 'Female'),
        (GENDER_NONBINARY, 'Non-binary'),
        (GENDER_OTHER, 'Other'),
    )
    gender = models.CharField(max_length=16, choices=GENDER_CHOICES, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    @property
    def pronouns(self):
        """Return a short pronoun string like 'he/him', 'she/her', 'they/them', or ''."""
        g = (self.gender or '').lower()
        if g == self.GENDER_MALE:
            return 'he/him'
        if g == self.GENDER_FEMALE:
            return 'she/her'
        if g == self.GENDER_NONBINARY or g == self.GENDER_OTHER:
            return 'they/them'
        return ''


class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    link = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Achievement(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    year = models.PositiveIntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.title} ({self.year})" if self.year else self.title


class Participation(models.Model):
    event = models.CharField(max_length=200)
    year = models.PositiveIntegerField()
    note = models.TextField(blank=True)

    def __str__(self):
        return f"{self.event} {self.year}"


class ContactMessage(models.Model):
    name = models.CharField(max_length=120)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} <{self.email}> - {self.created_at:%Y-%m-%d}"


class GallerySection(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self):
        return self.title


def gallery_image_upload_path(instance, filename):
    # store images under media/gallery/<section-slug>/
    return f'gallery/{instance.section.slug}/{filename}'


class GalleryImage(models.Model):
    section = models.ForeignKey(GallerySection, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to=gallery_image_upload_path)
    caption = models.CharField(max_length=250, blank=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'created_at']

    def __str__(self):
        return self.caption or f'Image {self.pk} of {self.section.title}'


def project_image_upload_path(instance, filename):
    pid = getattr(instance.project, 'id', None) or 'unassigned'
    return f'projects/{pid}/{filename}'


class ProjectImage(models.Model):
    project = models.ForeignKey('Project', related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to=project_image_upload_path)
    caption = models.CharField(max_length=250, blank=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'created_at']

    def __str__(self):
        return self.caption or f'Image {self.pk} of {self.project.title}'
