from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from django.db.models import Q
import numpy as np
import pandas as pd
from pythainlp.tokenize import word_tokenize
from pythainlp.spell import correct
import os
from pathlib import Path
from .models import Comments, Audience
from django.http import JsonResponse

BASE_DIR = Path(__file__).resolve(strict=True).parent.parent

neg_pd = pd.read_csv(os.path.join(BASE_DIR, 'analysis/config/neg.txt'), sep = "/n", header = None, encoding='utf8', engine='python')
neg = np.array(neg_pd)

neutral_pd = pd.read_csv(os.path.join(BASE_DIR, 'analysis/config/neutral.txt'), sep = "/n", header = None, encoding='utf8', engine='python')
neutral = np.array(neutral_pd)

pos_pd = pd.read_csv(os.path.join(BASE_DIR, 'analysis/config/pos.txt'), sep = "/n", header = None, encoding='utf8', engine='python')
pos = np.array(pos_pd)

high_pos_pd = pd.read_csv(os.path.join(BASE_DIR, 'analysis/config/highpos.txt'), sep = "/n", header = None, encoding='utf8', engine='python')
high_pos = np.array(high_pos_pd)

high_neg_pd = pd.read_csv(os.path.join(BASE_DIR, 'analysis/config/highneg.txt'), sep = "/n", header = None, encoding='utf8', engine='python')
high_neg = np.array(high_neg_pd)

# @csrf_exempt
def main(request):
    if request.GET:
        audience_id = int(request.GET["audienceID"])
        audienceComments= Comments.objects.filter(audienceID=audience_id)
        allAudienceComments = ""
        if audienceComments:
            for text in audienceComments:
                if text.text:
                    allAudienceComments += f'{text.text} '
        if allAudienceComments != "":
            score = word_interest(allAudienceComments)
            audience = Audience.objects.using('itppg').filter(id=audience_id)
            print(audience_id)
            print(score)
            audience.update(score=score)
    return render(request, 'index.html', {'name': "It's work on my machine"})

def word_interest(sentence):
    token_word = word_tokenize(sentence)
    list_word = []
    for word in token_word:
        if word.isspace():
            continue
        else:
            new_word = correct(word)
            list_word.append(new_word)

    cus_score = []
    pos_score = 0
    neg_score = 0

    for word in list_word:
        if word in high_neg:
            neg_score += 3
        elif word in neg:
            neg_score += 1
        else:
            neg_score += 0

    for word in list_word:
        if word in high_pos:
            pos_score += 3
        elif word in neg:
            pos_score += 1
        else:
            pos_score += 0

    score = 50
    if pos_score != 0 or neg_score != 0:
        score = (pos_score/(neg_score+pos_score))*100

    return score

def checkautohide(request):
    score = 50 # defined local
    if request.GET:
        comment_id = request.GET["commentID"]
        audienceComments= Comments.objects.filter(commentID=comment_id)
        print(audienceComments)
        allAudienceComments = ""
        if audienceComments:
            for text in audienceComments:
                if text.text:
                    allAudienceComments = f'{text.text} '

        if allAudienceComments != "":
            score = word_interest(allAudienceComments)
            print(score)
            if score < 50:
                Comments.objects.filter(commentID=comment_id).update(hidden=True)
    jsonscore = { 'analyscore': score }
    return JsonResponse(jsonscore)