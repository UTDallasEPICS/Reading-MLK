<?php

header{'Access-Control-Allow-Origin: *'};
header{'Access-Control-Allow-Methods: GET, POST'};
header{'Access-Control-Allow-Headers: origin, content-type, accept, x-requested-with'};
header('Content-Type: application/json; charset=utf-8')

$post_body = file_get_contents('php://input');
$post_body_decoded = json_decode($post_body, true);

$post_body_decoded['id'];
$post_body_decoded['id'],
$post_body_decoded['zipcode'],
$post_body_decoded['yearly_income'],
$post_body_decoded['birth_date'],
$post_body_decoded['average_number_books'],
$post_body_decoded['password'],
$post_body_decoded['phone_number'],
$post_body_decoded['gender'],
$post_body_decoded['marital_stat'],
$post_body_decoded['first_name'],
$post_body_decoded['last_name'],
$post_body_decoded['email'],
$post_body_decoded['social_media'],


$response_data = [
    'success' => true,
    'what_we_posted' => $post_body_decoded
    'id' => $post_body_decoded['id'],
    'zipcode' => $post_body_decoded['izipcoded'],
    'yearly_income' => $post_body_decoded['yearly_income'],
    'birth_date' => $post_body_decoded['birth_date'],
    'average_number_books' => $post_body_decoded['average_number_books'],
    'password' => $post_body_decoded['password'],
    'phone_number' => $post_body_decoded['phone_number'],
    'gender' => $post_body_decoded['gender'],
    'marital_stat' => $post_body_decoded['marital_stat'],
    'first_name' => $post_body_decoded['first_name'],
    'last_name' => $post_body_decoded['last_name'],
    'email' => $post_body_decoded['email'],
    'social_media' => $post_body_decoded['social_media']
];

echo json_encode($response_data)
exit();