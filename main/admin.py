from django.contrib import admin
from .models import TeamMember, Project, Achievement, Participation, ContactMessage
from .models import GallerySection, GalleryImage
from django.utils.html import format_html
from .models import ProjectImage


@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ('photo_tag', 'name', 'title', 'gender', 'created_at')
    search_fields = ('name', 'title', 'email', 'instagram', 'linkedin')
    list_filter = ('gender',)
    readonly_fields = ()
    fieldsets = (
        (None, {'fields': ('name', 'email', 'title', 'bio', 'gender', 'photo')}),
        ('Social', {'fields': ('instagram', 'linkedin', 'x')}),
    )

    def photo_tag(self, obj):
        if obj.photo:
            return format_html('<img src="{}" style="width:56px;height:56px;object-fit:cover;border-radius:8px" />', obj.photo.url)
        return '(no photo)'
    photo_tag.short_description = 'Photo'


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'link', 'created_at')
    search_fields = ('title',)
    inlines = []


class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 1
    fields = ('image', 'caption', 'order')

# attach inline to ProjectAdmin dynamically
ProjectAdmin.inlines = [ProjectImageInline]


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = ('title', 'year')
    list_filter = ('year',)


@admin.register(Participation)
class ParticipationAdmin(admin.ModelAdmin):
    list_display = ('event', 'year')
    list_filter = ('year',)


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'created_at', 'read')
    list_filter = ('read', 'created_at')
    search_fields = ('name', 'email', 'message')


class GalleryImageInline(admin.TabularInline):
    model = GalleryImage
    extra = 1
    fields = ('image', 'caption', 'order')


@admin.register(GallerySection)
class GallerySectionAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'order', 'created_at')
    prepopulated_fields = {'slug': ('title',)}
    inlines = [GalleryImageInline]


@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'section', 'order', 'created_at')
    list_filter = ('section',)
    search_fields = ('caption',)
