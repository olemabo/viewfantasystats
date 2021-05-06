from django.shortcuts import render

# Create your views here.

def index(request):
    """View function for home page of site."""

    info_text = 'welcome'

    context = {
        'text': info_text,
    }

    # Render the HTML template index.html with the data in the context variable
    return render(request, 'index.html', context=context)