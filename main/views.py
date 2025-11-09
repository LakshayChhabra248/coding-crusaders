from django.shortcuts import render, redirect
from django.contrib.auth.decorators import user_passes_test
from django.contrib.auth.decorators import login_required
from django.conf import settings
from django.contrib.auth import authenticate, login
from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages
from django import forms
from django.contrib.auth.models import User
from .models import TeamMember
from .models import GallerySection, Project, Achievement, Participation, ContactMessage
from django.urls import reverse


# Custom forms
class EmailLoginForm(forms.Form):
    email = forms.EmailField(label='Email', required=True)
    password = forms.CharField(label='Password', widget=forms.PasswordInput, required=True)


class SignupForm(UserCreationForm):
    email = forms.EmailField(required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2')


def home(request):
    # Render the original single-page home (index.html) with all sections
    try:
        team_members = TeamMember.objects.all().order_by('created_at')
    except:
        team_members = []
    
    try:
        projects = Project.objects.all().order_by('-created_at')[:8]
    except:
        projects = []
    
    try:
        achievements = Achievement.objects.all().order_by('-year')[:8]
    except:
        achievements = []
    
    try:
        participations = Participation.objects.all().order_by('-year')[:8]
    except:
        participations = []
    
    # show a quick success flag if contact was just submitted
    contact_sent = request.GET.get('contact') == '1'
    return render(request, 'index.html', {
        'team_members': team_members,
        'projects': projects,
        'achievements': achievements,
        'participations': participations,
        'contact_sent': contact_sent,
        'page_title': 'Coding Crusaders - Creative Web Development & Design',
        'page_description': 'Explore the portfolio of Coding Crusaders - a team of talented developers and designers creating fluid, interactive web experiences.',
        'page_keywords': 'web development, design, animation, interactive experiences, portfolio, coding',
    })


def about(request):
    return render(request, 'about.html', {
        'page_title': 'About Coding Crusaders - Our Team & Vision',
        'page_description': 'Learn about Coding Crusaders - our mission, core values, and the talented team behind innovative web development and design solutions.',
        'page_keywords': 'about us, team, company values, mission, web development team, design agency',
    })


def team(request):
    try:
        team_members = TeamMember.objects.all().order_by('created_at')
    except:
        team_members = []
    return render(request, 'team.html', {
        'team_members': team_members,
        'page_title': 'Our Team - Coding Crusaders',
        'page_description': 'Meet the talented developers and designers behind Coding Crusaders. Learn about each team member and their expertise.',
        'page_keywords': 'team members, developers, designers, web developers, creative team, portfolio',
    })


def projects(request):
    try:
        projects = Project.objects.all().order_by('-created_at')
    except:
        projects = []
    return render(request, 'projects.html', {
        'projects': projects,
        'page_title': 'Our Projects - Coding Crusaders Portfolio',
        'page_description': 'Explore our portfolio of innovative web development projects, featuring interactive experiences and creative design solutions.',
        'page_keywords': 'projects, portfolio, web development projects, case studies, design work, interactive websites',
    })


def contact(request):
    # Accept POST from the contact page form and persist a ContactMessage
    if request.method == 'POST':
        name = request.POST.get('name', '').strip()
        email = request.POST.get('email', '').strip()
        subject = request.POST.get('subject', '').strip()
        message_text = request.POST.get('message', '').strip()
        if name and email and message_text:
            ContactMessage.objects.create(name=name, email=email, message=message_text)
            messages.success(request, "Thank you! We've received your message and will get back to you soon.")
            return redirect('main:contact')
    return render(request, 'contact.html', {
        'page_title': 'Contact Us - Coding Crusaders',
        'page_description': 'Get in touch with Coding Crusaders for your web development and design projects. We respond within 24-48 hours.',
        'page_keywords': 'contact, email, project inquiry, web development services, design services, hire developers',
    })


def achievements(request):
    try:
        achievements = Achievement.objects.all().order_by('-year')
    except:
        achievements = []
    try:
        participations = Participation.objects.all().order_by('-year')
    except:
        participations = []
    return render(request, 'achievements.html', {
        'achievements': achievements,
        'participations': participations,
        'page_title': 'Achievements & Awards - Coding Crusaders',
        'page_description': 'Discover the achievements, awards, and event participations of the Coding Crusaders team in web development and design.',
        'page_keywords': 'achievements, awards, events, competitions, recognitions, hackathons, web development awards',
    })


def gallery_index(request):
    sections = GallerySection.objects.prefetch_related('images').all()
    return render(request, 'gallery_index.html', {
        'sections': sections,
        'page_title': 'Gallery - Coding Crusaders',
        'page_description': 'Browse the photo gallery showcasing our team, events, and creative work at Coding Crusaders.',
        'page_keywords': 'gallery, photos, events, team photos, creative work, portfolio gallery',
    })


def gallery_projects(request):
    # show projects with their images grouped
    projects = Project.objects.prefetch_related('images').all()
    return render(request, 'gallery_projects.html', {
        'projects': projects,
        'page_title': 'Project Gallery - Coding Crusaders',
        'page_description': 'Explore our project gallery showcasing the visual work, designs, and creative implementations from our portfolio.',
        'page_keywords': 'project gallery, portfolio, project images, design work, creative projects, web development portfolio',
    })


def gallery_section(request, slug):
    section = GallerySection.objects.prefetch_related('images').filter(slug=slug).first()
    if not section:
        return redirect('main:gallery_index')
    images = section.images.all()
    return render(request, 'gallery_section.html', {
        'section': section,
        'images': images,
        'page_title': f'{section.title} - Coding Crusaders Gallery' if section else 'Gallery - Coding Crusaders',
        'page_description': f'{section.description}' if section else 'Browse our photo gallery.',
        'page_keywords': f'gallery, {section.title.lower()}, photos, events' if section else 'gallery, photos',
    })


def _is_privileged_user(u):
    if not u or not getattr(u, 'is_authenticated', False):
        return False
    if getattr(u, 'is_staff', False) or getattr(u, 'is_superuser', False):
        return True
    allowed = getattr(settings, 'ADMIN_ALLOWED_EMAILS', []) or []
    email = getattr(u, 'email', '') or ''
    return email.lower() in [s.lower() for s in allowed]


@user_passes_test(_is_privileged_user)
def studio(request):
    """Protected simple studio dashboard linking to admin change lists.

    Access is allowed for staff/superuser or any user whose email is
    included in `settings.ADMIN_ALLOWED_EMAILS`.
    """
    return render(request, 'studio.html', {
        'page_title': 'Studio - Coding Crusaders',
        'page_description': 'Coding Crusaders Studio - Content management and administration dashboard.',
        'page_keywords': 'studio, admin, dashboard, content management',
    })


def auth_login(request):
    """Simple login view that accepts email (or username) + password.

    Also shows a "Continue with Google" link that points to allauth.
    """
    if request.user.is_authenticated:
        return redirect('main:home')

    form = EmailLoginForm(request.POST or None)
    error = None
    if request.method == 'POST' and form.is_valid():
        email = form.cleaned_data['email']
        password = form.cleaned_data['password']
        # try to find user by email
        try:
            user = User.objects.get(email__iexact=email)
            username = user.get_username()
            user = authenticate(request, username=username, password=password)
        except User.DoesNotExist:
            # try authenticate using the provided value as username
            user = authenticate(request, username=email, password=password)

        if user is not None:
            login(request, user)
            return redirect('main:home')
        else:
            error = 'Invalid credentials'

    return render(request, 'login.html', {
        'form': form,
        'error': error,
        'page_title': 'Login - Coding Crusaders',
        'page_description': 'Log in to your Coding Crusaders account or sign up with Google.',
        'page_keywords': 'login, sign in, authentication, account',
    })


def auth_signup(request):
    """Signup view: normal signup form plus 'Sign up with Google' link."""
    if request.user.is_authenticated:
        return redirect('main:home')

    form = SignupForm(request.POST or None)
    if request.method == 'POST' and form.is_valid():
        user = form.save(commit=False)
        user.email = form.cleaned_data.get('email')
        user.save()
        # log the user in
        raw_password = form.cleaned_data.get('password1')
        user = authenticate(request, username=user.username, password=raw_password)
        if user is not None:
            login(request, user)
            return redirect('main:home')

    return render(request, 'signup.html', {
        'form': form,
        'page_title': 'Sign Up - Coding Crusaders',
        'page_description': 'Create a new account with Coding Crusaders or sign up with Google.',
        'page_keywords': 'signup, register, create account, sign up',
    })


@login_required
def profile(request):
    """Show a simple profile page for the current user.

    Role resolution:
    - Team Leader: user.is_superuser or user.is_staff
    - Team Member: a TeamMember exists whose name contains the user's username or first name
    - Other: default
    """
    user = request.user
    role = 'Other'
    tag_class = 'other'
    # Team leader (staff/superuser or registered privileged email)
    if getattr(user, 'is_superuser', False) or getattr(user, 'is_staff', False):
        role = 'Team Leader'
        tag_class = 'leader'
    else:
        # Only consider a user a Team Member when there is a TeamMember with an exact email match
        team_member = None
        if user.email:
            team_member = TeamMember.objects.filter(email__iexact=user.email).first()
        if team_member:
            role = 'Team Member'
            tag_class = 'member'
        else:
            role = 'Other'
            tag_class = 'other'

    # ensure team_member variable exists (may be None)
    try:
        team_member
    except NameError:
        team_member = None

    return render(request, 'profile.html', {
        'profile_user': user,
        'role': role,
        'tag_class': tag_class,
        'team_member': team_member,
        'page_title': 'My Profile - Coding Crusaders',
        'page_description': 'View and manage your Coding Crusaders profile.',
        'page_keywords': 'profile, account, user profile, settings',
    })
